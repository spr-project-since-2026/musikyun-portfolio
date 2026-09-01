# ミュージキュン（Musikyun）

音楽✖️体験✖️言語化。<br>
感動を共有する音楽メディア

A music media connecting songs with personal experiences.

⸻
## 特徴

- 音楽とリスナーの体験を結びつけたレビュー設計
- 編集フローを組み込んだCMS
- ライター / 編集者の役割分離による品質管理
- スマートフォン / PC 両対応

⸻

## 概要

楽曲そのものの魅力だけでなく、
「なぜ心が動いたのか」「どんな体験と結びついたのか」を言語化。<br>
 聴く → 感じる → 言語化 → 創作という流れを通じて、<br>
 音楽との関係を深めることを目的としています。

⸻

## 技術的こだわり
- React + SupabaseによるシンプルなCMS構成
- 認証ベースのロール管理（ライター / 編集者）
- 最小機能に絞った設計（運用しやすさ重視）
- 画像1枚ルールなど、コンテンツ統制設計

⸻

## 投稿フロー

draft（下書き）
→ in_review（公開依頼）
→ published（公開）
→ needs_revision（差し戻し）

編集者による確認を必須とし、品質を担保した運用フローを実装しています。

⸻

## スクリーンショット
### トップページ　（ PC / スマホ ）
<p align="center">
  <img src="./top_pc.png" width="65%" style="margin-left: -40px;" />
  <img src="./top_sp.png" width="30%" />
</p>

### ライター画面（ PC / スマホ ）
記事の作成・編集・公開依頼が可能な画面
<p align="center">
  <img src="./writer_pc.png" width="65%" style="margin-left: -40px;" />
  <img src="./writer_sp.png" width="30%" />
</p>

### 編集者画面（ PC / スマホ ）
記事の公開・非公開・差し戻しを管理する画面
<p align="center">
  <img src="./editor_pc.png" width="65%" style="margin-left: -40px;" />
  <img src="./editor_sp.png" width="30%" />
</p>
⸻

## デモ

🔗 https://spr-project-since-2026.github.io/musikyun-portfolio/

⸻
## サンプル記事

🔗 Take It Easy / Eagles  
https://spr-project-since-2026.github.io/musikyun-portfolio/#/article/take-it-easy-20260401-01

⸻
## 開発背景

音楽を「消費するもの」ではなく、  
**リスナーの体験と結びつくものとして捉えたい**という思いから制作しました。

また、実運用を想定し、  
編集フローや権限管理まで設計に組み込んでいます。

⸻

## 今後の展望

- 英語対応（グローバル展開）
- SEO改善
