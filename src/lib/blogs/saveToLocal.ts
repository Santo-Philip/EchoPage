function saveToLocal(blogId: string, data: JSON) {
  localStorage.setItem(`draft-${blogId}`, JSON.stringify({
    ...data,
    updatedAt: Date.now()
  }));
}

export default saveToLocal;
