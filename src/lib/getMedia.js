function getMedia(id) {
  return `${process.env.REACT_APP_API_URL}/assets/${id}`;
}

export default getMedia;
