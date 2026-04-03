export const generateTransaction = async () => {
  const res = await fetch("http://localhost:8080/api/transactions/generate", {
    method: "GET"
  });

  return res.json();
};
