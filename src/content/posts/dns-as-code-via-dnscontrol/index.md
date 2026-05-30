---
title: 使用 DNSControl 管理 DNS 记录
published: 2026-05-04T15:20:00+08:00
description: DNS 作为互联网基础设施的基石之一，也是最脆弱的环节之一。基础设施即代码（Infrastructure as Code, IaC）无疑为脆弱的 DNS 记录管理给出了一个方向。
category: '技术分享'
draft: true
lang: ""
---
# 前言
曾经我手贱删了一条 DNS 记录。当时我部署了 `Uptime Kuma`，它也照常给我发了邮件。我起初没在意，以为是普通的超时报警。直到有人跟我说`XX 服务访问不了，快去修`的时候，我才认真翻看 Uptime Kuma 的报警消息，这才发现——原来是我把 DNS 记录删了。最后赶紧登上华为云把记录加回去，这场持续半个多小时的事故才算结束。

# 契机
在折腾`edgetunnel`的时候，发现了`ip.skk.moe`，点开[Sukka's Blog](https://blog.skk.moe/)，找到了[用代码和 Git 管理 DNS 记录 —— DNSControl 和 GitHub Actions CI/CD 实践](https://blog.skk.moe/post/dns-as-code-via-dnscontrol/)，我认真阅读了数次，决定使用`DNSControl`和`Git`管理我的 DNS 记录

# 准备
1. 访问[quick start tutorial](https://docs.dnscontrol.org/getting-started/getting-started)（~~为什么在中国查不到`dnscontrol.org`的 DNS 记录☹~~），根据文档指示下载
以 Windows 10 为例（运行命令要改成`.\dnscontrol.exe`），访问[GitHub](https://github.com/StackExchange/dnscontrol/releases/latest)，在下方Assets中找到含有`windows`字样的文件并下载。[DNSControl 4.36.1 程序](https://github.com/DNSControl/dnscontrol/releases/download/v4.36.1/dnscontrol_4.36.1_windows_amd64.zip)，如果 Github 访问困难，可以使用[DNSControl 4.36.1 程序](https://gh.acmsz.top/https://github.com/DNSControl/dnscontrol/releases/download/v4.36.1/dnscontrol_4.36.1_windows_amd64.zip)。解压备用。
2. 使用[SukkaW](https://github.com/SukkaW)的仓库模板去创建一个 Git 仓库，访问[Create a new repository](https://github.com/new?template_name=dnscontrol-gitops-template&template_owner=SukkaW)，`Repository name`随便填，如果你不希望别人看到你的 DNS 记录，那就将`Choose visibility`中的`Public`改成`Private`，点击`Create repository`创建仓库。
3. 将仓库克隆到本地。点击绿色的`Code`，复制仓库 Git 地址，在电脑在打开`Git Bash`或其他 Git 程序，输入
```shell
git clone <Git 地址>
```
4. 将第一步解压的文件移到仓库，并使用代码编辑器（VSCode）打开文件夹

# 开始使用 DNSControl
DNSControl 的文件结构非常简单，只需要两个文件即可：
- creds.json：记录 DNS 供应商 API Token 等认证信息
- dnsconfig.js：DNS 记录配置文件，使用 JavaScript 作为 DSL 描述 DNS 记录 
其中，`creds.json` 中可以直接引用环境变量名称：
```json
{
  "cloudflare": {
    "TYPE": "CLOUDFLAREAPI",
    "accountid": "$CLOUDFLARE_ACCOUNT_ID",
    "apitoken": "$CLOUDFLARE_API_TOKEN"
  }
},
  "huaweicloud": {
    "TYPE": "HUAWEICLOUD",
    "KeyId": "$HUAWEICLOUD_ACCESS_KEY_ID",
    "SecretKey": "$HUAWEICLOUD_SECRET_ACCESS_KEY",
    "Region": "$HUAWEICLOUD_SERVICE_REGION"
  }
}
```
而 dnsconfig.js 则可以使用 JavaScript 来描述 DNS 记录：
```javascript
var REG_NONE = NewRegistrar('none');
var DSP_CLOUDFLARE = NewDnsProvider('cloudflare');
D('acmsz.top', REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  DefaultTTL(300),
  A('@', '1.1.1.1'),
);
```
如果要启用 IDE 的代码补全和类型检查，DNSControl 内置了 TypeScript 类型声明文件，可以通过 CLI 生成：
```shell
dnscontrol write-types
```
 然后就可以在 `dnsconfig.js` 文件的开头引用类型声明文件了：
 ```javascript
 // @ts-check
 /// <reference path="types-dnscontrol.d.ts" />
 ```
在上方仓库已经配置好了，但还是强烈建议执行
```shell
dnscontrol write-types
```
去更新 TypeScript 类型声明文件。

# 迁移到 DNSControl
无需手动从 DNS 供应商的控制平面中逐条复制 DNS 记录到 `dnsconfig.js` 文件中，DNSControl 支持直接导出现有的 DNS 记录（~~`WARNING: To retain compatibility in future versions, please change "CLOUDFLAREAPI" to "-".`，改了就会`Arguments should be: credskey providername zone(s) (Ex: r53 ROUTE53 example.com)`☹~~）：
```shell
dnscontrol get-zones --format=js --out=draft.js cloudflare CLOUDFLAREAPI example.com
```

导出的 JavaScript 文件并不建议直接使用，但是可以作为一个起点，将记录复制到正式的 `dnsconfig.js` 中。

# 小技巧
## 在 dnsconfig.js 中为同一个域名配置不同的记录
DNSControl 支持 Split Horizon DNS，可以为同一个域名配置不同的 namespace、每个 namespace 下可以有不同的 DNS 供应商和不同的 DNS 记录。namespace 通过 `!` 符号来区分：
```javascript
D(
  'example.com', REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  DefaultTTL(1),

  NS('www', 'ns1.huaweicloud-dns.com.'),
  NS('www', 'ns1.huaweicloud-dns.cn.'),
  NS('www', 'ns1.huaweicloud-dns.net.'),
  NS('www', 'ns1.huaweicloud-dns.org.'),
);

D(
  'example.com!huaweicloud', REG_NONE, DnsProvider(DSP_HUAWEICLOUD),
  DefaultTTL(300),

  CNAME('www', 'cdn.example.com.'),
);
```
通过这种方式，可以将 `example.com` 的权威 DNS 记录部署在 Cloudflare 上，而将 `www.example.com` 的子域部署在华为云上，实现国内 DNS 服务器解析。

## dnsconfig.js 编写技巧
DNSControl 使用了 JavaScript 作为 DSL，因此可以使用 JavaScript 的各种特性来提升配置文件的可读性和可维护性：
**使用变量和函数复用 CNAME 记录，提升了可维护性。**
```
var WETEST_CF_CNAME = 'cloudflare.182682.xyz.';

CNAME('blog', WETEST_CF_CNAME),
CNAME('www', WETEST_CF_CNAME),
```

**使用函数为多个子域名复用多条 NS**
```javascript
/**
 * @param {string} label
 * @param {RecordModifier} [ttl]
 */
function RECORD_SET_ALPHA(label, ttl) {
  ttl = ttl || END;
  return [
    NS(label, 'ns1.huaweicloud-dns.com.', ttl),
    NS(label, 'ns1.huaweicloud-dns.cn.', ttl),
    NS(label, 'ns1.huaweicloud-dns.net.', ttl),
    NS(label, 'ns1.huaweicloud-dns.org.', ttl),
  ];
}

D(
  'example.com', REG_NONE,
  DnsProvider(DSP_CLOUDFLARE),
  DefaultTTL(300),
  HUAWEICLOUD_NS('blog'),
  HUAWEICLOUD_NS('www'),
);
```

`IGNORE`、`IGNORE_NAME`、`IGNORE_TARGET` 等函数可以让 DNSControl 忽略某些 DNS 记录的变更，让 DNSControl 管理的 DNS 记录与 DNS 供应商控制的 DNS 记录共存、互相不干扰：
```
// 忽略所有 Cloudflare Zero Trust 自动创建和管理的 CNAME 记录
IGNORE_TARGET('*.cfargotunnel.com.', 'CNAME'),
// 忽略所有 Cloudflare Email Routing 自动创建和管理的只读 DKIM 记录
IGNORE_NAME('*._domainkey', 'TXT'),
```