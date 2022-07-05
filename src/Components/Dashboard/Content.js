import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, fs } from "../../Config/Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
function Content() {
  const [user, setUser] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            setUser(snapshot.data().FirstName + " " + snapshot.data().LastName);
            setLoading(true);
          });
      } else {
        history.push("/login");
      }
    });
  }, []);
  return (
    <div className="wrapper">
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
            <div>
              {loading ? (
                <p>Admin : {user} </p>
              ) : (
                <p>
                  Admin :{" "}
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="spinner"
                    size="1x"
                    style={{ marginRight: "2px" }}
                  />
                </p>
              )}
              <p>Website Title : Thai Sun</p>
              <p>
                Website URL :{" "}
                <a
                  href="http://www.thaisun.co.uk/"
                  style={{ textDecoration: "none" }}
                >
                  http://www.thaisun.co.uk/
                </a>
              </p>
            </div>
          </div>
          {/* /.container-fluid */}
        </div>
      </div>
    </div>
  );
}

export default Content;
