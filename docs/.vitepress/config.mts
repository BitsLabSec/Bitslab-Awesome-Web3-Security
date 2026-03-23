import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/Bitslab-Awesome-Web3-Security/',
  title: "Bitslab-Awesome-Web3-Security",
  description: "A Web3 Security Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/' }
        ]
      },
      {
        text: 'Lending安全',
        items: [
          { text: '业务简介', link: '/Lending_业务简介' },
          { text: '漏洞分析', link: '/Lending_漏洞' },
          { text: 'Lending_Checklist', link: '/Lending_Checklist' }
        ]
      },
      {
        text: 'Staking安全',
        items: [
          { text: '业务简介', link: '/Staking_业务简介' },
          { text: '漏洞分析', link: '/Staking_漏洞' },
          { text: 'Staking_Checklist', link: '/Staking_Checklist' }
        ]
      },
      {
        text: 'Oracle安全',
        items: [
          { text: 'Oracle_Checklist', link: '/Oracle_Checklist' }
        ]
      },
      {
        text: 'Dex安全',
        items: [
          { text: 'Dex_Checklist', link: '/Dex_Checklist' },
          { text: 'CLMM DLMM_Checklist', link: '/CLMM DLMM_Checklist' }
        ]
      },
      {
        text: 'Crosschain安全',
        items: [
          { text: 'Crosschain_Checklist', link: '/Crosschain_Checklist' }
        ]
      },

      {
        text: 'ERC20安全',
        items: [
          { text: 'ERC20_Checklist', link: '/ERC20_Checklist' }
        ]
      },
      {
        text: 'ERC721安全',
        items: [
          { text: 'ERC721_Checklist', link: '/ERC721_Checklist' }
        ]
      },
      {
        text: 'ERC4626安全',
        items: [
          { text: 'ERC4626_Checklist', link: '/ERC4626_Checklist' }
        ]
      },
      {
        text: 'ERC1155安全',
        items: [
          { text: 'ERC1155_Checklist', link: '/ERC1155_Checklist' }
        ]
      },
      {
        text: 'StableCoin安全',
        items: [
          { text: 'StableCoin_Checklist', link: '/StableCoin_Checklist' }
        ]
      },
      {
        text: '密码学安全',
        items: [
          { text: '密码学_Checklist', link: '/密码学_Checklist' }
        ]
      },
      {
        text: 'SPV安全',
        items: [
          { text: 'SPV_Checklist', link: '/SPV_Checklist' }
        ]
      },
      {
        text: '比特币衍生资产安全',
        items: [
          { text: '比特币衍生资产_Checklist', link: '/比特币衍生资产_Checklist' }
        ]
      },
      {
        text: 'Ton安全',
        items: [
          { text: 'Ton_Checklist', link: '/Ton_Checklist' }
        ]
      },
      {
        text: 'Solana安全',
        items: [
          { text: 'Solana_Checklist', link: '/Solana_Checklist' }
        ]
      },
      {
        text: 'Resources',
        items: [
          { text: '漏洞学习资料', link: '/漏洞学习资料' },
          { text: '合约+业务学习资料', link: '/合约+业务学习资料' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // 启用本地搜索功能
    search: {
      provider: 'local'
    },

    // mdBook style usually has outline on the right, keeping it for now but can be disabled
    outline: 'deep'
  }
})
