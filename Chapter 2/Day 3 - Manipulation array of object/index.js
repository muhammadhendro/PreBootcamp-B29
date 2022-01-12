const express = require("express");
const app = express();
const port = 5000;

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
  let newBlogs = blogs.map((data) => {
    return { ...data, isLogin };
  });

  res.render("blog", { isLogin, blogs: newBlogs, title: "Creating Blog Page" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Me" });
});

app.get("/detail-blog/:id", (req, res) => {
  let id = req.params.id;

  res.render("blog-detail", { id, title: "Blog Page Detail" });
});

app.post("/blog", (req, res) => {
  let data = req.body;

  data = {
    title: data.title,
    content: data.content,
    author: "Muhammad Hendro",
    post_at: getFullTime(new Date()),
    //ago: getDistanceTime(new Date())
  };

  blogs.push(data);
  res.redirect("/blog");
});

app.get("/delete-blog/:index", (req, res) => {
  let index = req.params.index;
  blogs.splice(index, 1);
  res.redirect("/blog");
});

app.get("/edit-blog/:index", (req, res) => {
  let index = req.params.index;
  let title = blogs[index].title;
  let content = blogs[index].content;

  res.render("edit-blog", { index, title, content, judul: "Edit Blog" });
});
app.post("/edit-blog/", (req, res) => {
  let data = req.body;

  let index = data.index;
  
 
  
  blogs[index] = {
    title : data.title,
    content : data.content,
    author: "Muhammad Hendro",
    post_at: getFullTime(new Date()),
  }
  console.log(blogs)
  res.redirect("/blog");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>ERROR 404</h1>");
});

app.listen(port, () => {
  console.log(`Server starting on port: ${port}`);
});

function getFullTime(time) {
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
  let distance = timeNow - time;

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
