export const getDate = (time) => {
  let date = new Date(Number(time * 1000));

  return date.toLocaleString();
};
