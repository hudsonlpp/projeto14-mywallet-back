import db from "./config.js";

const validateAuth = async (req, res, next) => {
  const authorizationInfo = req.headers.authorization;
  if (!authorizationInfo) return res.status(401).send('Informe o token de autorização');
  const token = authorizationInfo.replace('Bearer ', '');
  const session = await db.collection('sessions').findOne({ token });
  if (!session) return res.sendStatus(401);
  res.locals.session = session;
  next();
};

const validateSchema = (schema) => {
    return (req, res, next) => {
    console.log(req.body)
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send(errors);
      }
      next();
    };
  };

export {validateAuth, validateSchema};