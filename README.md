# 世界くらべ / World, Compared

ばらばらに公開されているデータを組み合わせて、世界の国を比べる7つのサイトです。日本語・English・中文・한국어・Español に対応しています。

Seven sites that combine scattered public data to compare countries, in Japanese, English, Chinese, Korean and Spanish.

**https://arai-sarai-data.github.io/world-compare/**

| # | サイト / Site | 組み合わせたデータ / Data combined |
|---|---|---|
| 01 | [1時間働くと、何が買える？ / What does an hour of work buy?](jikyu/) | ILOSTAT earnings & hours × The Economist Big Mac index × World Bank PPP & CPI |
| 02 | [税金の元は取れている？ / Are taxes paying off?](zei/) | UNU-WIDER tax revenue × 7 World Bank outcome indicators |
| 03 | [国の約束、守られてる？ / Are countries keeping their promises?](yakusoku/) | SIPRI, OECD DAC, World Bank health & education × NATO / UN / Abuja / Incheon targets |
| 04 | [援助した国は、国連で味方する？ / Does aid buy votes at the UN?](enjo/) | OECD DAC bilateral aid × UN General Assembly votes (Voeten) |
| 05 | [議員は国民に似ている？ / Do parliaments look like their people?](giin/) | IPU Parline × World Bank population × UN WPP median age |
| 06 | [このパスポートで、どこに住める？ / Where could you live with your passport?](sumeru/) | Passport Index × World Bank prices, safety, internet × ERA5 temperature |
| 07 | [災害の被害は「備え」で決まる？ / Do disasters hit harder than wealth predicts?](saigai/) | WHO disaster deaths × EM-DAT damages × World Bank GDP |

## 仕組み / How it works

- `lib/*.mjs` が各データ源から取得・集計し、`data/*.json` を作ります（Node 20 以上）。
- GitHub Actions が毎週月曜に全データを更新して GitHub Pages に公開します。取得に失敗したサイトは前回のデータを使い続けます。
- 画面は静的な HTML と JavaScript だけで動きます。

```bash
node scripts/build.mjs all      # すべて更新 / rebuild everything
node scripts/build.mjs zei      # 1つだけ / one site
node scripts/check.mjs          # 検査 / sanity checks
npx serve .                     # ローカル表示 / local preview
```

## 方針 / Principles

1. すべての数字に出典を付け、計算方法を各ページとコードで公開する。 / Every number has a source; methods are on each page and in code.
2. 相関と因果を区別し、注意点を書く。 / Correlation is not causation; caveats are stated.
3. 無料で誰でも使える。 / Free for everyone.

## ライセンス / Licence

コードは MIT License。集計結果は CC BY 4.0。元データはそれぞれの提供元の利用条件に従います。
