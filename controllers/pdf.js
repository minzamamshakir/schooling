const pdf = require("pdf-creator-node");
const breakArr = require("@encodix/chunkify");
const fs = require("fs");
let cdDate = (dt) => {
  const today = new Date(dt);
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = dd + "/" + mm + "/" + yyyy;
  return formattedToday;
};
exports.create = (req, res) => {
  let users = breakArr(req.body, 15);

  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 300px;
        font-size: 24px;
      }
      .date{
      left:600px;
      }
      .signDiv{
          position: relative;
          left: 980px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:50px;
      }
      body{
        padding:20px;
      }
  </style>
  </head>
  <body>
${users
  .map(
    (user, i) =>
      `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: ${cdDate(
          new Date().toLocaleDateString()
        )}</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table style="border:1px solid black;margin-top: 30px;border-collapse: collapse;width:100%;>
      <thead style="font-size: 10px;">
        <tr style="width: 5%;">
        <th style='border:1px solid black; width: 3%; font-size: 10px;text-align: left;'>Sr#</th>
          ${Object.keys(user[0])
            .map(
              (item) =>
                `<th style='border:1px solid black; width: 5%; font-size: 10px;text-align: left;'>${item}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${user
          .map(
            (item, i) =>
              `<tr style='width: 5%; font-size: 10px;'><td style='border:1px solid black;width: 3%;'>${
                i + 1
              }</td>
              ${Object.keys(user[0])
                .map(
                  (key) =>
                    `<td style='border:1px solid black;width: 5%;'>${item[key]}</td>`
                )
                .join("")}</tr>`
          )
          .join("")}
      </tbody>
    </table>
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
  )
  .join("")}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.createPicPdf = (req, res) => {
  let users = breakArr(req.body, 5);

  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 270px;
        font-size: 24px;
      }
      .date{
      left:495px;
      }
      .signDiv{
          position: relative;
          left: 865px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:30px;
      }
      body{
        padding:20px;
      }
  </style>
  </head>
  <body>
${users
  .map(
    (user, i) =>
      `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: ${cdDate(
          new Date().toLocaleDateString()
        )}</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table style="border:1px solid black;margin-top: 30px;border-collapse: collapse;width:100%;>
      <thead style="font-size: 10px;">
        <tr style="width: 5%;">
        <th style='border:1px solid black; width: 3%; font-size: 10px;text-align: left;'>Sr#</th>
          ${Object.keys(user[0])
            .map(
              (item) =>
                `<th style='border:1px solid black; width: 5%; font-size: 10px;text-align: left;'>${item}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${user
          .map(
            (item, i) =>
              `<tr style='width: 5%; font-size: 10px;'><td style='border:1px solid black;width: 3%;'>${
                i + 1
              }</td>
              ${Object.keys(user[0])
                .map((key) => {
                  if (key === "pic") {
                    return `<td style='border:1px solid black;width: 5%;'><img src = "https://server.ghazalians.com/${item[key]}" style='width: 65px; height:65px'/></td>`;
                  } else {
                    return `<td style='border:1px solid black;width: 5%;'>${item[key]}</td>`;
                  }
                })
                .join("")}</tr>`
          )
          .join("")}
      </tbody>
    </table>
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
  )
  .join("")}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });
};
exports.guardCreate = (req, res) => {
  let guard = req.guardiansData;
  let users = breakArr(guard, 2);
  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 300px;
        font-size: 24px;
      }
      .date{
      left:600px;
      }
      .signDiv{
          position: relative;
          left: 980px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:50px;
      }
      body{
        padding:20px;
      }
        table{
     border: solid;
     text-align: center;
     width: 100%;
      border-collapse: collapse;
            margin-top: 20px;
  }
  tr{
    border: solid;
    height: 40px;
  }
  td{
    border: solid;
    width : 10%;
  }
    th{
    border: solid;
    width : 10%;
  }
  .clr{
    background-color: black;
    color:white;
  }
  </style>
  </head>
  <body>
${
  users &&
  users.length &&
  users
    .map(
      (user, i) =>
        `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: ${cdDate(
          new Date().toLocaleDateString()
        )}</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table>
      <thead>
         <tr class="clr">
            <th>Reg Num</th>
            <th>Guardian Name</th>
            <th>Job</th>
            <th>Education</th>
            <th colspan="2">Cnic</th>
        </tr>
      </thead>
            <tbody>
                                ${
                                  user &&
                                  user.length &&
                                  user
                                    .map(
                                      (user1) =>
                                        `
                                  <tr class="clr">
                                    <td>${user1 && user1.regNum}</td>
                                    <td>
                                      ${
                                        user1 &&
                                        user1.guardian &&
                                        user1.guardian.name
                                      }
                                    </td>
                                    <td>
                                      
                                      ${
                                        user1 &&
                                        user1.guardian &&
                                        user1.guardian.job
                                      }
                                    </td>
                                    <td>
                                    
                                      
                                      ${
                                        user1 &&
                                        user1.guardian &&
                                        user1.guardian.education
                                      }
                                    </td>
                                    <td colspan="2">
                                      
                                      ${
                                        user1 &&
                                        user1.guardian &&
                                        user1.guardian.cnic
                                      }
                                    </td>
                                  </tr>
                                                      <tr>
                    <th rowspan=${1 + user1.childs.length}>Child's</th>
                      <th>Roll No</th>
                      <th> Std Name</th>
                      <th>Reg Num</th>
                      <th>Class</th>
                      <th>Section</th>

                    </tr>
                                        ${
                                          user1.childs &&
                                          user1.childs.length &&
                                          user1.childs
                                            .map((dat2) => {
                                              return `<tr>
                            <td>${dat2 && dat2.rollNo}</td>
                            <td>${dat2 && dat2.stdName}</td>
                            <td>${dat2 && dat2.admissionNo}</td>
                            <td>${dat2.class && dat2.class.name}</td>
                            <td>${dat2.section && dat2.section.name}</td>
                          </tr>`;
                                            })
                                            .join("")
                                        }
                                  `
                                    )
                                    .join("")
                                }
                    

 
                </tbody>
         </table>  
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
    )

    .join("")
}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });
};
exports.createPaidSalaryPdf = (req, res) => {
  let users = breakArr(req.body, 5);

  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 270px;
        font-size: 24px;
      }
      .date{
      left:495px;
      }
      .signDiv{
          position: relative;
          left: 865px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:30px;
      }
      body{
        padding:20px;
      }
  </style>
  </head>
  <body>
${users
  .map(
    (user, i) =>
      `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: ${cdDate(
          new Date().toLocaleDateString()
        )}</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table style="border:1px solid black;margin-top: 30px;border-collapse: collapse;width:100%;>
      <thead style="font-size: 10px;">
        <tr style="width: 5%;">
        <th style='border:1px solid black; width: 3%; font-size: 10px;text-align: left;'>Sr#</th>
          ${Object.keys(user[0])
            .map(
              (item) =>
                `<th style='border:1px solid black; width: 5%; font-size: 10px;text-align: left;'>${item}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${user
          .map(
            (item, i) =>
              `<tr style='width: 5%; font-size: 10px;'><td style='border:1px solid black;width: 3%;'>${
                i + 1
              }</td>
              ${Object.keys(user[0])
                .map((key) => {
                  if (key === "pic") {
                    return `<td style='border:1px solid black;width: 5%;'><img src = "https://server.ghazalians.com/${item[key]}" style='width: 65px; height:65px'/></td>`;
                  } else {
                    return `<td style='border:1px solid black;width: 5%;'>${item[key]}</td>`;
                  }
                })
                .join("")}</tr>`
          )
          .join("")}
      </tbody>
    </table>
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
  )
  .join("")}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });
};