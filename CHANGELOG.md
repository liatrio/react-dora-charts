# CHANGELOG

## v2.0.3 (2024-08-27)

### Fix

* fix: update cfr to be a layered bar graph, refactored tooltip (#97) ([`ca3f2bf`](https://github.com/liatrio/liatrio-react-dora/commit/ca3f2bf86a4b1b335b2643b0a33e7a555ec72399))

## v2.0.2 (2024-08-26)

### Fix

* fix: adjust failure rate graph to show bars side by side, update readme (#96) ([`f66fb48`](https://github.com/liatrio/liatrio-react-dora/commit/f66fb489e3e15c9ec53c9c93c1da2149e79dafbb))

## v2.0.1 (2024-08-26)

### Fix

* fix: fix x axis labels and other bugs (#95)

* fix: don&#39;t penalize teams for not having data for a metric in trends

* fix: fix broken charts

* fix: scenario where df could fail to render ([`166778a`](https://github.com/liatrio/liatrio-react-dora/commit/166778a093abdc1a6052cd7311a3b9c8a1496217))

## v2.0.0 (2024-08-26)

### Breaking

* feat!: Add Trend Chart (#91)

* fix!: major refactor to clean up code

* chore: update readme

* fix!: more refactoring

* chore: update readme

* chore: update readme

* fix: filter the buildDoraState by the dates supplied in props

* chore: add trend files

* feat: Update Board to support showing trends instead of scores

* chore: fix leading spacing in some files

* feat: Add Trend Chart

* fix: adjust trends to always end on a week end

* chore: update stories to allow switching out the data viewed

* fix: update readme, rename some components &amp; types to be more clear

* chore: cleanup code

* chore: update tests

* fix: update storybook stories to be editable in the browser

* fix: update story book to be more streamlined and have editor options

* chore: get rid of the addon toolbar in storybook

* chore: make a storybook ci that doesn&#39;t open the browser

* feat: add legend to trend graph

* fix: adjusting trend time display

* fix: found the error with the timing

* fix: make lines thicker, remove logging, simplify a few things

* fix: simplify these

---------

Co-authored-by: Wolftousen &lt;eliot.t.eikenberry@perilforge.com&gt; ([`ab5d1f2`](https://github.com/liatrio/liatrio-react-dora/commit/ab5d1f2a66014f0e060235c0b201e290b95e23d9))

## v1.0.37 (2024-08-21)

### Fix

* fix: address bug when nodata locks charts out (#80)

* fix: rework this bit

* fix: address bug when nodata locks charts out ([`96ce948`](https://github.com/liatrio/liatrio-react-dora/commit/96ce9489f146a7903668f2569b1815b9ccb35b44))

## v1.0.36 (2024-08-21)

### Fix

* fix: rework this bit (#79) ([`9196858`](https://github.com/liatrio/liatrio-react-dora/commit/91968582b1a88817057a03ef180e915f361126aa))

## v1.0.35 (2024-08-20)

### Fix

* fix: adjust tooltip link limit (#78)

* fix: limit links to 5 in tooltip

* fix: handle no data and no api ([`9b5b113`](https://github.com/liatrio/liatrio-react-dora/commit/9b5b11322b0e27e0d73777cfc1004ac3a456f8f4))

## v1.0.34 (2024-08-20)

### Fix

* fix: correct issue of data being null/empty (#77) ([`db95192`](https://github.com/liatrio/liatrio-react-dora/commit/db95192d1f9c6766bf702dacfb24fbb2bbdeb61f))

## v1.0.33 (2024-08-19)

### Fix

* fix: make message box have static height (#76) ([`a7a406a`](https://github.com/liatrio/liatrio-react-dora/commit/a7a406af929a34f3cca4b4750398577ccbc4c169))

## v1.0.32 (2024-08-19)

### Fix

* fix: make these else ifs (#75) ([`39089ec`](https://github.com/liatrio/liatrio-react-dora/commit/39089ec6a52d0768afc4240d545e080ffa1de24d))

## v1.0.31 (2024-08-19)

### Fix

* fix: forgot to add this to scoreboard (#74) ([`a9237da`](https://github.com/liatrio/liatrio-react-dora/commit/a9237da963d6c671fbd34c2d06d87d75c535cf06))

## v1.0.30 (2024-08-19)

### Fix

* fix: force version (#73) ([`fa3c2a8`](https://github.com/liatrio/liatrio-react-dora/commit/fa3c2a87a1f41dc81d4f6430b889192b72cda9b4))

### Unknown

* Bug fix (#72)

* fix: fixing tooltips and charts for teams display

* fix: missing code for base recover time, add custom message option ([`be350be`](https://github.com/liatrio/liatrio-react-dora/commit/be350bee2bd5615dd0596121abc3148bdecaded3))

## v1.0.29 (2024-08-17)

### Fix

* fix: fixing tooltips and charts for teams display (#71) ([`250cabd`](https://github.com/liatrio/liatrio-react-dora/commit/250cabd5d62189fa1d62ffbce9736a47642444e6))

## v1.0.28 (2024-08-15)

### Fix

* fix: push failure record here too (#70) ([`d8e936f`](https://github.com/liatrio/liatrio-react-dora/commit/d8e936f1d86ef4174776157b8d83f2ea792a6792))

## v1.0.27 (2024-08-15)

### Fix

* fix: adjust tooltips and chart labels for rt/clt (#69) ([`cad8faf`](https://github.com/liatrio/liatrio-react-dora/commit/cad8faf7cb1e2d09044291c414a0d07295073684))

## v1.0.26 (2024-08-15)

### Fix

* fix: multiply cfr score x 100 instead of clt score (#68) ([`35bd37f`](https://github.com/liatrio/liatrio-react-dora/commit/35bd37f0050325bf9867a112cf7a0026ed404581))

## v1.0.25 (2024-08-15)

### Fix

* fix: only show tooltip when not showing details (#67) ([`01a7212`](https://github.com/liatrio/liatrio-react-dora/commit/01a7212d8357c139bc91a2049e38557a78184b87))

## v1.0.24 (2024-08-15)

### Fix

* fix: forgot to export this function (#66) ([`0f2b9f6`](https://github.com/liatrio/liatrio-react-dora/commit/0f2b9f639c2a6ff15e3745488c3805724f85bbb0))

## v1.0.23 (2024-08-15)

### Fix

* fix: simpley score titles and account for bad data (#65) ([`dc9eead`](https://github.com/liatrio/liatrio-react-dora/commit/dc9eead6e68e7e9d84e0725bd7f2bb661cdb316a))

## v1.0.22 (2024-08-15)

### Fix

* fix: force ver bump (#64) ([`398384b`](https://github.com/liatrio/liatrio-react-dora/commit/398384b78aaa1c81f364524925b55755913629ed))

### Unknown

* Bug fix (#63)

* fix: forgot to undo this

* fix: adjust month length to just be 30 days ([`9acb3e3`](https://github.com/liatrio/liatrio-react-dora/commit/9acb3e3dd3b5f193727cd6e12a5ec993edad4af0))

## v1.0.21 (2024-08-15)

### Fix

* fix: forgot to undo this (#62) ([`689135e`](https://github.com/liatrio/liatrio-react-dora/commit/689135e2e738179671cca7b02be69ddba4c75685))

## v1.0.20 (2024-08-15)

### Fix

* fix: deep copy date to prevent modifications (#61) ([`50b7192`](https://github.com/liatrio/liatrio-react-dora/commit/50b71921569aa4c10e5da8369aa6cec90cd1d3ba))

## v1.0.19 (2024-08-14)

### Fix

* fix: 100xrate for cfr color check (#60) ([`4c99639`](https://github.com/liatrio/liatrio-react-dora/commit/4c996397015641793a7ad81ec71d7aa06e2dc3b8))

## v1.0.18 (2024-08-14)

### Fix

* fix: make measure optional all the way down, use correct measure for clt (#59) ([`e129019`](https://github.com/liatrio/liatrio-react-dora/commit/e129019d749fe5ee201637a3b72baeaae6d6fdcc))

## v1.0.17 (2024-08-14)

### Fix

* fix: adjust measure names, fix stories (#58) ([`7d3ad06`](https://github.com/liatrio/liatrio-react-dora/commit/7d3ad06db8d6e0e325153f2c48ff2b6819723d27))

## v1.0.16 (2024-08-14)

### Fix

* fix: use correct measures, adjust measure names (#57) ([`f21f23f`](https://github.com/liatrio/liatrio-react-dora/commit/f21f23f1fef3d99b7a429e40434cd0c06743696d))

## v1.0.15 (2024-08-14)

### Fix

* fix: account for filters not being directly exported (#56) ([`8771797`](https://github.com/liatrio/liatrio-react-dora/commit/87717978b75235ba5209afa5ccb7190c4b9af297))

## v1.0.14 (2024-08-14)

### Fix

* fix: fix exports (#55) ([`b4c67bf`](https://github.com/liatrio/liatrio-react-dora/commit/b4c67bfe62590434e0eec961b542ceed4b193ca0))

## v1.0.13 (2024-08-14)

### Fix

* fix: streamline score board (#54)

* fix: align scoreboard tooltip with other charts

* fix: cleanup colors

* fix: account for fixedAt not being available

* fix: make sure failed at gets set properly ([`0784e41`](https://github.com/liatrio/liatrio-react-dora/commit/0784e41330c485cc7178533515b5d6b9e486edf8))

## v1.0.12 (2024-08-14)

### Fix

* fix: expose unknown filter (#53)

* fix: expose scores and colors

* chore: cleanup import

* fix: expose the unknown filter ([`f38ab61`](https://github.com/liatrio/liatrio-react-dora/commit/f38ab614d22e32931a4ec5aefa1e73154d861fd4))

## v1.0.11 (2024-08-14)

### Fix

* fix: expose scores and colors (#52)

* fix: expose scores and colors

* chore: cleanup import ([`bcdd59e`](https://github.com/liatrio/liatrio-react-dora/commit/bcdd59eca14d2b70ea4edf7d901375b3bcb64cd8))

## v1.0.10 (2024-08-13)

### Fix

* fix: various bug fixes (#51)

* fix: calc falsly infalted builds by 1 in CFR

* fix: only show 2 decimal places in clt tooltip

* fix: try to handle persistent tooltip issue better

* fix: offset tooltip in clt to mirror others

* chore: update test data

* fix: make x-axis padding uniform across charts

* fix: change clt to bar graph ([`d54ba72`](https://github.com/liatrio/liatrio-react-dora/commit/d54ba72928d0882dd9256a6b1f80c2a80dc3e76b))

## v1.0.9 (2024-08-10)

### Fix

* fix: skip weekends for ctl too (#46) ([`11268d6`](https://github.com/liatrio/liatrio-react-dora/commit/11268d619afa2e200775f95056cd9e09865438b0))

* fix: disable ReCharts tooltip and replace with react-tooltip (#45) ([`a989acb`](https://github.com/liatrio/liatrio-react-dora/commit/a989acbf6aa7e4bcb507510bbd26ed9e3d6d654f))

## v1.0.8 (2024-08-08)

### Fix

* fix: correct formula for cfr per day (#44) ([`6a7cc98`](https://github.com/liatrio/liatrio-react-dora/commit/6a7cc9882e5c48df6a2ec07595fdd30aaf609f12))

## v1.0.7 (2024-08-08)

### Fix

* fix: provide links in the tooltip (#43) ([`3fe6b82`](https://github.com/liatrio/liatrio-react-dora/commit/3fe6b82bb6e9dbdf60bf8331d2c97b44b5428cb7))

## v1.0.6 (2024-08-07)

### Fix

* fix: change how base tooltip is displayed (#42) ([`fb59db4`](https://github.com/liatrio/liatrio-react-dora/commit/fb59db457ef90a9248f84d7d653cf256f269c390))

## v1.0.5 (2024-08-07)

### Fix

* fix: remove dead color ([`61f957e`](https://github.com/liatrio/liatrio-react-dora/commit/61f957eff6d622db7fc2b2ed36a5580d75ec14fa))

### Unknown

* Enhanced tool tip (#40)

* fix: click node for more info

* fix: allow clicking a node for more info ([`429aedd`](https://github.com/liatrio/liatrio-react-dora/commit/429aedd81fcd7689e25b7c3dd37c253d04159618))

## v1.0.4 (2024-08-07)

### Fix

* fix: click node for more info (#39) ([`0cbada5`](https://github.com/liatrio/liatrio-react-dora/commit/0cbada5a079f478d22b8a464c3ebdf5d6a2fee8a))

* fix: shift yellow and orange to medium/low, use blue as high (#38) ([`689d7e8`](https://github.com/liatrio/liatrio-react-dora/commit/689d7e8df9a82f3c9cc47e110f92f35a65552a34))

## v1.0.3 (2024-08-03)

### Fix

* fix: make default end date 1 day in the past (#37) ([`779674d`](https://github.com/liatrio/liatrio-react-dora/commit/779674d3bdbf52cf9369e33d47932ec2a87bb467))

## v1.0.2 (2024-07-30)

### Fix

* fix: force ver bump (#36) ([`4b28d1c`](https://github.com/liatrio/liatrio-react-dora/commit/4b28d1c5275bf563d4deb4579b41ca8d30a9af13))

### Unknown

* Visual bug fixes (#35)

* chore: update readme

* fix: shrink max bar size for df

* fix: add padding to x-axis

* fix: disable random colors

* chore: remove dead code ([`fd9b983`](https://github.com/liatrio/liatrio-react-dora/commit/fd9b98341689e369d4d33b521daa10311db8396c))

## v1.0.1 (2024-07-29)

### Chore

* chore: update readme (#33) ([`2eae6bc`](https://github.com/liatrio/liatrio-react-dora/commit/2eae6bc5cfc1b7b245932c76840a1f33d2d7a482))

### Fix

* fix: visual adjustments (#34)

* chore: update readme

* fix: shrink max bar size for df

* fix: add padding to x-axis

* fix: send non-utc into compoenents, convert api response dates to local

---------

Co-authored-by: root &lt;root@Tegia.localdomain&gt; ([`44087de`](https://github.com/liatrio/liatrio-react-dora/commit/44087dee32ba4feeed0921fd809eb5dba530823f))

## v1.0.0 (2024-07-29)

### Breaking

* build!: 1.0.0 ([`b76cb12`](https://github.com/liatrio/liatrio-react-dora/commit/b76cb1284da6a44a0bebdf344f8028a2445ed941))
