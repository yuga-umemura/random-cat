import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  // マウント時に画像を読み込む
  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url);
  //     setLoading(false);
  //   })
  // }, [])
  const handleClick = async () => {
    setLoading(true); // 読み込み中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  }
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} />}</div>
    </div>
  )
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  // 配列として表現されているか
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした。");
  };
  const image: unknown = images[0];
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした。");
  }
  return image;
}

// 型ガード関数
const isImage = (value: unknown): value is Image => {
  // 値がオブジェクトかどうか
  if (!value || typeof value != "object") {
    return false;
  }
  // urlプロパティが存在し、かつそれが文字列なのか
  return "url" in value && typeof value.url === "string";
};