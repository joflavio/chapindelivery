module.exports = {
    apps : [{
      name   : "chapindelivery",
      script : "./app.js",
      env: {
          "NODE_ENV": "production",
          "INIT_DB":"false",
          "PORT":"8626",
          "TOKEN_KEY":"i8o65TQIddw5vgsWizQZuQU0WZsb76FOaeLDKXgdZUS5611Y6rRhXI0Yguf9FhBfZ3UBBdvAQgOBbfkY"
      }
    }]
  }
  