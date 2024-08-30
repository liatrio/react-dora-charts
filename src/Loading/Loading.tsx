import styles from './loading.module.css';

interface Props {
  enabled: boolean;
}

const Loading = (props: Props) => {
  if (!props.enabled) {
    return <></>;
  }

  return (
    <div className={styles.overlay}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loading;
