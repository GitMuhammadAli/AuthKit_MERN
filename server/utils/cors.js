module.exports = {
  corsOptions: {
    origin: "http://localhost:4000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};
