export default (req, res, next) => {
    if(req.user.isAdm) {
        console.log("Adm autorizado com sucesso")
        next();
      } else {
        res.status(403).send({ message: "Just adm users can use this feature" });
      }
  };
  