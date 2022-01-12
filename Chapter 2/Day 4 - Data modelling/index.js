const express = require("express");
const app = express();
const port = 5000;

const db = require("./connection/db");

let isLogin = true;

let blogs = [
  {
    title: "Pasar Coding di Indonesia Dinilai Masih Menjanjikan",
    post_at: "12 Jul 2021 22:30 WIB",
    author: "Ichsan Emrald Alamsyah",
    content:
      "Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan. Berdasarkan penelitian ",
  },
];
let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Desember",
];

app.set("view engine", "hbs");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/add-blog", (req, res) => {
  res.render("add-blog", { title: "Add New Blog" });
});

app.get("/blog", (req, res) => {
  // let dataBlogs = blogs.map((data) => {
  //   return { ...data, isLogin };
  // });
  db.connect((err, client, done) => {
    if (err) throw err;

    client.query("SELECT * FROM tb_blog", (err, result) => {
      done();
      let data = result.rows;
      let newData = data.map((d) => {

        return { ...d, isLogin, author: "Muhammad Hendro",post_ago: getDistanceTime(d.post_date), post_at: getFullTime(d.post_date) };
        
      });

//let date = post_ago.getDate();


      res.render("blog", {
        isLogin,
        blogs: newData,
        
        title: "Creating Blog Page",
      });
    });
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Me" });
});

app.get("/detail-blog/:index", (req, res) => {
  let index = req.params.index;
  // let title = blogs[index].title;
  // let content = blogs[index].content;

  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM tb_blog WHERE id=${index}`, (err, result) => {
      done();
      let data = result.rows;
      let title = data[0].title;
      let content = data[0].content;

      res.render("blog-detail", { index, title, content, judul: "Edit Blog" });
    });
  });
});

app.post("/blog", (req, res) => {
  let data = req.body;

  data = {
    title: data.title,
    content: data.content,
    author: "Muhammad Hendro",
    post_at: new Date(),
    //post_ago: getDistanceTime(new Date())
    //post_date_ori: new Date()
  };
  let image = "image.png";
  //blogs.push(data);
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      `INSERT INTO tb_blog(
       title, content, image, post_date )
      VALUES ( '${data.title}', '${data.content}', '${image}', '${data.post_at}' )`,
      (err, result) => {
        done();
      }
    );
    res.redirect("/blog");
  });
});
app.post("/edit-blog/", (req, res) => {
  let data = req.body;

  let index = data.index;
  let title = data.title;
  let content = data.content;
  //let author = "Muhammad Hendro";
  //let post_at = getFullTime(new Date());
  //ago: getDistanceTime(new Date())

 // let image = "image.png";

  //blogs.push(data);
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      `UPDATE tb_blog SET
       title='${title}', content='${content}'
      WHERE id=${index}`,
      (err, result) => {
        done();
      }
    );
    res.redirect("/blog");
  });
});

app.get("/delete-blog/:index", (req, res) => {
  let index = req.params.index;
  //index = parseInt(index) + 1
  // blogs.splice(index, 1);
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`DELETE FROM tb_blog WHERE id=${index}`, (err, result) => {
      done();
    });
  });
  res.redirect("/blog");
});

app.get("/edit-blog/:index", (req, res) => {
  let index = req.params.index;
  // let title = blogs[index].title;
  // let content = blogs[index].content;

  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM tb_blog WHERE id=${index}`, (err, result) => {
      done();
      let data = result.rows;
      let title = data[0].title;
      let content = data[0].content;

      res.render("edit-blog", { index, title, content, judul: "Edit Blog" });
    });
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>ERROR 404</h1>");
});

app.listen(port, () => {
  console.log(`Server starting on port: ${port}`);
});

function getFullTime(t) {
  let time = new Date(t)
  let date = time.getDate();
  let monthIndex = time.getMonth();
  let year = time.getFullYear();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let fullTime = `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB`;
  return fullTime;
}

function getDistanceTime(time) {
  let timeNow = new Date();
  let distance = timeNow - Date.parse(time);

  // convert to day => ms in 1d
  let miliseconds = 1000; // 1ms in 1s
  let secondInHours = 3600; //1ms in 1h
  let hoursInDay = 23; // hours in 1d
  let daysInMonth = 30;
  let monthInYear = 12;

  // convert to year
  let distanceYear = Math.floor(
    distance /
      (miliseconds * secondInHours * hoursInDay * daysInMonth * monthInYear)
  );
  if (distanceYear >= 1) {
    return `${distanceYear} year ago`;
  } else {
    // convert to month
    let distanceMonth = Math.floor(
      distance / (miliseconds * secondInHours * hoursInDay * daysInMonth)
    );

    if (distanceMonth >= 1) {
      return `${distanceMonth} month ago`;
    } else {
      // convert to day
      let distanceDay = Math.floor(
        distance / (miliseconds * secondInHours * hoursInDay)
      );
      if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
      } else {
        // convert to hour
        let distanceHours = Math.floor(distance / (miliseconds * 60 * 60));
        if (distanceHours >= 1) {
          return `${distanceHours} hours ago`;
        } else {
          // convert to minute
          let distanceMinutes = Math.floor(distance / (miliseconds * 60));
          if (distanceMinutes >= 1) {
            return `${distanceMinutes} minutes ago`;
          } else {
            let distanceSeconds = Math.floor(distance / miliseconds);
            return `${distanceSeconds} seconds ago`;
          }
        }
      }
    }
  }
}
