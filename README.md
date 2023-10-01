
[Shad](https://shad-app.vercel.app/) は、GPXファイルの斜度(勾配)を可視化するWebアプリです。主にサイクリングの計画作成等に有用です。

現時点ではまだまだ作成中👷‍♂であり、今後機能増強を行っていきます。

![image](https://github.com/tris5572/shad/assets/68403260/e14b381b-8c97-49d6-8d63-740d34d2ed1e)

![image](https://github.com/tris5572/shad/assets/68403260/eb56003b-a118-4fad-b5b4-e7e41f3391d0)

# 使い方

1. 画面にGPXファイルをドロップします。
   - 手持ちのGPXファイルがない場合、`samples` フォルダに入っているものが使えます。
2. 必要に応じて「GPX」画面で描画対象範囲を設定します。
3. 地図上やコースプロフィール図により斜度が可視化されます。👍

勾配のプロフィールの画像はSVG画像として生成されているため、ベクター系の画像編集ソフト（Inkscape や Adobe Illustrator）により編集可能です。

# モチベーション

サイクリングを行う際、勾配に関する情報は重要です。これはヒルクライムのようにタイムを気にする場合も、そうではなくロングライドでゆるゆると登る場合も同じです。

そこで、サイクルロードレースでよく目にする、勾配のプロフィール図を手軽に作成できれば(自分が)助かる、ということで作ってみました。

# 今後の機能向上予定（一部）

- コースプロフィール表示の細かいカスタマイズ
- 画像(SVG)の保存
- GPXファイルの均し（主に標高の誤差）

# 技術スタック

- TypeScript
- Next.js + App Router
- MapLibre GL JS (+ React Map GL)
