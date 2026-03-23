
## Bitcoin & Asset Protocol

**Bitcoin & Asset Protocol-01: 铭文/符文序号偏移量计算 (Commit-Reveal Offset)**

- **描述**：Bitcoin 资产协议（如 Ordinals）常使用 Commit-Reveal 机制，需防止在 Reveal 阶段因偏移量（Offset）计算错误导致资产挂错输入输出。

- **检查要点**：审查对 `OP_PUSH` 数据的长度解析逻辑，确保资产刻录在预期的第一个有效 Sat（聪）上。检查在多输入多输出（MIMO）交易中，资产跟随逻辑是否严格遵守协议定义的优先级顺序，防止资产流向非预期的 Output。


**Bitcoin & Asset Protocol-02: 尘埃阈值与手续费保护 (Dust Limit & Fee Protection)**

- **描述**：资产协议通常依赖极小面额的 UTXO（如 546 聪），需防止因低于比特币网络尘埃阈值导致交易被丢弃或资产被误当作手续费。

- **检查要点**：检查构造交易时是否动态检测了 `Dust Limit`。审查 `SIGHASH` 类型，确保签名覆盖了所有输出金额，防止攻击者通过增加手续费（Siphoning）的方式将资产 UTXO 变相“吃掉”。



**Bitcoin & Asset Protocol-03: 见证数据溢出与解析器拒绝服务 (Witness DoS)**

- **描述**：由于资产元数据（Metadata）存储在 Witness 字段中，恶意构造的超大脚本或深度嵌套的脚本包（Script Envelopes）可能导致解析器崩溃。

- **检查要点**：审查解析器对 `OP_IF` / `OP_ENDIF` 嵌套深度的限制。验证在解析大体积 Witness 数据时是否有内存配额限制，防止索引器（Indexer）因为处理非法格式的数据而发生内存溢出（OOM）。


**Bitcoin & Asset Protocol-04: 脚本公共前缀欺骗 (Script Prefix Mimicry)**

- **描述**：攻击者可能构造一个包含资产协议特征码（如 `ord` 或 `R`）但逻辑完全不同的脚本，试图欺骗解析不严谨的索引器。

- **检查要点**：审查协议识别逻辑是否严格校验了 `OP_FALSE OP_IF` 等前置操作码。确保索引器不仅匹配关键字，还验证了其在脚本中的精确位置（通常是第一个交易输入的见证脚本）。


**Bitcoin & Asset Protocol-05: 资产转移的原子性与双花防范 (Atomicity & Double-Spend)**

- **描述**：在 PSBT（部分签名的比特币交易）构建中，需确保资产转出与对价（如 BTC）的转入在逻辑上是原子绑定的。

- **检查要点**：审查 PSBT 签名过程是否使用了 `SIGHASH_ALL` 以锁定所有输入输出。如果是分步成交，需验证在多方签名合并时，资产对应的 UTXO 索引未被篡改，防止资产被“偷换”。


**Bitcoin & Asset Protocol-06: 资产状态一致性归集 (State Consensus)**

- **描述**：Bitcoin 链上不存储资产余额状态，状态由链下索引器计算。需防止不同索引器对“非法转账”或“超出上限的铸造”处理不一致。

- **检查要点**：审查对非法操作（如超额 Mint）的降级处理逻辑（是忽略该交易，还是按剩余额度结算）。验证索引器是否具备处理 **Reorg（链回滚）** 的能力，确保资产余额状态能同步回滚。


**Bitcoin & Asset Protocol-07: 隔离见证兼容性与地址误用 (Address Mismatch)**

- **描述**：某些资产协议仅支持特定地址类型（如 P2TR），将资产发送至不支持的地址类型（如 Legacy P2PKH）可能导致资产永久锁死或无法被索引器识别。

- **检查要点**：检查前端和合约逻辑是否强制校验接收地址类型。审查在多签环境下，是否正确处理了脚本路径（Scr

## order book
