// 商品情報はここでまとめて編集できます。
// 実際の販売商品が決まったら、名前・価格・カテゴリ・説明・画像を差し替えてください。
// image は画像URL、または assets フォルダ内の画像パスを指定できます。
const PRODUCTS = [
  {
    id: "sample-001",
    name: "プロ仕様 ペイントブラシ",
    category: "塗装用品",
    price: 1280,
    description: "細かな部分の塗装を想定したサンプル商品です。",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80",
    tag: "PICK UP"
  },
  {
    id: "sample-002",
    name: "作業用ローラーセット",
    category: "塗装用品",
    price: 1980,
    description: "日々の作業をイメージしたローラーセットのサンプルです。",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    tag: "人気商品"
  },
  {
    id: "sample-003",
    name: "マスキングテープ 3巻セット",
    category: "消耗品",
    price: 680,
    description: "消耗品カテゴリを見せるためのサンプル商品です。",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
    tag: ""
  },
  {
    id: "sample-004",
    name: "現場用ツールバッグ",
    category: "作業用品",
    price: 3480,
    description: "工具や小物をまとめる商品のサンプルです。",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
    tag: "NEW"
  },
  {
    id: "sample-005",
    name: "保護メガネ",
    category: "安全用品",
    price: 980,
    description: "安全用品カテゴリを見せるためのサンプル商品です。",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
    tag: ""
  },
  {
    id: "sample-006",
    name: "メンテナンス用品セット",
    category: "作業用品",
    price: 2480,
    description: "商品構成を検討するための仮の商品です。",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80",
    tag: ""
  }
];
