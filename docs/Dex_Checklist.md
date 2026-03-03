- **Dex-01 泛型类型检查缺失**
    - **描述**：在Move语言中，就公共函数而言，泛型类型是另一种形式的用户输入，其有效性也必须经过检查。
    ```move
    public fun cancelorders<BaseCoinType>(
        user: &signer,
        order_id: u64
    ) acquires OrderStore, CoinStore{
    //[...]
        deposit<BaseCoinType>(order_store, address_of(user), order.base);
    //[...]
    }
    ```
    - **建议**：检查该类型是否为有效/白名单类型；验证该类型是否符合预期。
  
- **Dex-02 无限制执行**
    - **描述**：无限制执行是一种拒绝服务攻击，当用户可以向多个用户共享的循环代码（即可以被许多用户执行的代码）无限添加迭代次数时，就会发生这种攻击。
    ```move
    fun get_by_id(
        order_store: &OrderStore,
        order_id: u64
    ): (Option<Order>) {
        let i = 0;
        let len = vector::length(&order_store.orders);
        while (i < len) {
            let order = vector::borrow<Order>(&order_store.orders, i);
            if (order.id == order_id) {
                return option::some(*order)
            };
            i = i + 1;
        };

        return option::none<Order>()
    }
    ```
    - **建议**：应避免对所有数据进行遍历，转而对每个循环的迭代次数加以限制。
  
- **Dex-03 访问权限控制不当**
    - **描述**：仅接收 &signer 参数不足以实现访问控制，务必确认签名者是指定的预期账户。
    ```move
    public fun cancel<BaseCoinType>(
        user: &signer,
        order_id: u64
    ) acquires OrderStore, CoinStore {
        // [...]
        deposit<BaseCoinType>(order_store, address_of(user), order.base);
        // [...]
    }
    ```
    - **建议**：确认签名者与预期账户一致。

- **Dex-04 价格预言机操纵**
    - **描述**：协议基于交易对的流动性比率作为价格预言机，以此决定存取款时流动性代币的兑换数量。
    - **建议**：使用不易被操纵的外部预言机。

- **Dex-05 精度损失**
    - **描述**：利用舍入误差可规避协议费用。
    ```move
    public fun calculate_fees(
        size: u64
    ): (u64) {
        return size * FEE_BPS / 10000
    }

    ```
    - **建议**：确保协议费不为零。
  
- **Dex-06 缺乏对Coin账户注册的检查**
    - **描述**：Aptos框架的coin模块要求，在调用coin::deposit或coin::withdraw时，目标账户上必须已存在CoinStore。因此，该账户必须先通过coin::register完成注册。
    ```move
    public fun register<CoinType>(account: &signer) {
        let account_addr = signer::address_of(account);
        // Short-circuit and do nothing if account is already registered for CoinType.
        if (is_account_registered<CoinType>(account_addr)) {
            return
        };
        // [...]
    }

    ```
    - **建议**：当函数中无法使用签名者来注册账户时，代码应首先通过coin::is_account_registered检查该账户是否已注册，若未注册则应执行失败。
  
- **Dex-07 运算错误与结果不一致**
    - **描述**：Aptos Move原生支持u8、u16、u64整数类型。但在审计中，我们经常发现项目方会自定义类型来实现浮点数、定点数、有符号数或其他位宽的运算。请注意，这些自定义类型的溢出/下溢行为与内置的无符号整数类型可能不一致。

    - **建议**：确保不应回滚的代码不会遭遇除零、溢出和下溢等算术错误，因为这些错误会导致拒绝服务。

- **Dex-08 资源管理不当**
    - **描述**：在Aptos Move开发模型中，数据应当存储在转移至所有者账户的资源中，而非存放在模块账户的全局资源存储内。
    - **建议**：通过将资产置于账户内的可信资源中，所有者可以确保即使是恶意编写的模块也无法修改这些资产。
    - 
- **Dex-09 暂停功能**
    - **描述**：协议应具备高效暂停操作的能力.不可升级协议需内置暂停功能;可升级协议可通过合约或升级实现暂停.缺乏暂停机制会导致漏洞暴露时间过长,带来重大损失
    - **建议**：实现标准化的暂停功能。
  
- **Dex-10 避免赋予结构体过多的能力**
    - **描述**：使用 Move 创建自定义结构体时,应该预先考虑对象的使用场景，并为其分配“最小”权限，以防止出现意外操作。比如根据 sui::event 中的参数能力要求，只需要 copy 和 drop 能力即可。
    ```move
    module sui::event {
        public native fun emit<T: copy + drop>(event: T);
    }

    ```
    - **建议**：遵循最小权限原则设计结构体。
  
- **Dex-11 应冻结Coin的元数据**
    - **描述**：在 Sui 系统中，除某些旨在实现创意功能的特定 NFT 类型外，所有代币的元数据都应冻结。如果元数据未被冻结，管理员修改这些数据可能会导致用户困惑。
    ```move
     fun init(witness: T, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<T>(witness,
            9,
            b"Token",
            b"Token",
            b"It is the native token for xxx",
            option::none(),
            ctx);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx))
        transfer::public_share_object(metadata);
    }

    ```
    - **建议**：将Coin的元数据设为冻结状态。
  
- **Dex-12 版本控制**
    - **描述**：在 Sui 中，合约（Package）本身就是链上对象，每次升级都会生成一个新的版本，而旧版本依然保留在链上。如果合约功能缺乏版本控制（Version Awareness），会带来一系列结构性和业务性风险。
    ```move
     public struct USigner has key, store {
        id: UID,
        owner: address,
        policy_id: ID,
        wallet_count: u32,
        /// Timestamp of last owner action (place, withdraw, register_share, etc.)
        /// Used by beneficiary_rule to detect owner inactivity
        last_owner_activity_ts: u64,
        /// Timestamp of last signing activity (any authorized signer)
        /// Used by timelock_rule for rate limiting between signatures
        last_signing_activity_ts: u64,
    }

    ```
    - **建议**：引入版本控制机制。
  
- **Dex-13 若使用vector、VecSet、VecMap、PriorityQueue等向量型集合，其最大容量应控制在1000个元素以内**
    - **描述**：如果 vector 元素超过 1000，不会直接报错（Move 没有固定 1000 上限），但会带来一系列性能和安全问题。
    - **建议**：对于允许第三方添加的任何集合、更大的集合以及大小未知的集合，请使用动态字段支持的集合（ Table 、 Bag 、 ObjectBag 、 ObjectTable 、 LinkedTable ）。
  
- **Dex-14 Move object 对象大小**
    - **描述**：Move object的最大大小为 250KB。任何创建更大对象的尝试都会导致交易中止。
    - **建议**：确保对象中没有不断增长的集合。

- **Dex-14 返回值检查**
    - **描述**：在 Move 中，检查某些函数的返回值至关重要。忽略这些返回值可能导致关键逻辑无法正确执行，从而引发安全问题。
    ```move
      public fun is_voter(voter: address): bool acquires VotingEscrow {
        let voting_escrow_address = get_voting_escrow_address();
        let voting_escrow = borrow_global<VotingEscrow>(voting_escrow_address);
        voter == voting_escrow.voter
    }
    //[...]
     voting_escrow::is_voter(voter_address);
    ```
    - **建议**：确保正确处理每个函数调用的返回值。
  
- **Dex-15 缺乏流动性激励**
    - **描述**：由于业务逻辑设计不当，部分协议无法为用户提供足够的激励来注入流动性。
    - **建议**：协议通过收取兑换或流动性变更操作中的费用，为流动性提供者创造经济激励。
  
- **Dex-16 溢出**
    - **描述**：Move 中，在进行数学运算时会进行溢出检查，运算溢出交易将失败。但需要注意的是位运算并不会进行检查。
    ```move
      fun earned_internal(
        bribe: &Bribe,
        owner: address,
        timestamp: u64,
        reward_token: address
    ): u64 {
        let balance = balance_of_owner_at_internal(&bribe.balance, owner, timestamp);
        if (balance == 0) { 0 }
        else {
            let reward_per_token = reward_per_token_internal(bribe, timestamp, reward_token);

            // calculation may lose precision in some case
            let rewards = (reward_per_token * balance) / MULTIPLIER;
            rewards
        }
    }
    ```
    - **建议**：所有算术运算前先验证操作数范围，确保结果不会溢出。
  
- **Dex-17 闪电贷攻击**
    - **描述**：在 Sui Move 中，可以使用 Hot Potato 模式 来实现更严格的闪电贷控制。若闪电贷对象具备drop能力，用户便可调用destroy将其销毁，从而规避还款。
    ```move
     struct FlashLoan has drop {
       // [...]
        amount: u64
    }
    ```
    - **建议**：严格限制能力，不要赋予 drop。

- **Dex-18 权限控制**
    - **描述**：权限漏洞这部分和业务的需求以及功能设计关系较大，所以遇见较为复杂的 Module 的时候，就需要和项目方一一确认各个方法的调用权限。这里的权限一般是指函数的可见性和函数的调用权限。
    ```move
    public fun cancel_approvals(
        policy: &mut SigningPolicy,
        _cap: &SigningPolicyCap,
        intent_hash: vector<u8>,
    ) {
        let intent_key = IntentApprovalKey { intent_hash };
        let policy_uid = signing_policy::policy_uid_mut(policy);
        
        if (sui::dynamic_field::exists_(policy_uid, intent_key)) {
            let _approvals: VecSet<address> = sui::dynamic_field::remove(
                policy_uid,
                intent_key
            );
        };
    }
    ```
    - **建议**：检查和确认所有函数方法的可见性及调用权限。

- **Dex-19 缺少滑点保护**
    - **描述**：在业务操作过程中，应允许用户自定义滑点保护参数，以防止交易遭受三明治攻击
    ```move
     public fun mint<X, Y, Curve>(coin_x: Coin<X>, coin_y: Coin<Y>): Coin<LP<X, Y, Curve>>
        acquires LiquidityPool, EventsStore {
        assert_no_emergency();

        assert!(coin_helper::is_sorted<X, Y>(), ERR_WRONG_PAIR_ORDERING);
        assert!(exists<LiquidityPool<X, Y, Curve>>(@liquidswap_pool_account), ERR_POOL_DOES_NOT_EXIST);

    ```
    - **建议**：允许用户自定义滑点参数。
  
- **Dex-20 新建流动性池应同步完成首次流动性添加**
    - **描述**：创建池子时不先添加流动性，恶意用户可通过捐赠攻击操控池子，损害后续流动性提供者利益
    ```move
        let provided_liq = if (lp_coins_total == 0) {
            let initial_liq = math::sqrt(math::mul_to_u128(x_provided_val, y_provided_val));
            assert!(initial_liq > MINIMAL_LIQUIDITY, ERR_NOT_ENOUGH_INITIAL_LIQUIDITY);
            initial_liq - MINIMAL_LIQUIDITY
        } else {
            let x_liq = math::mul_div_u128((x_provided_val as u128), lp_coins_total, (x_reserve_size as u128));
            let y_liq = math::mul_div_u128((y_provided_val as u128), lp_coins_total, (y_reserve_size as u128));
            if (x_liq < y_liq) {
                x_liq
            } else {
                y_liq
            }
        };

    ```
    - **建议**：确保池子创建与初始流动性添加的原子性。