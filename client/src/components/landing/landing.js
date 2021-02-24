import React, { Component } from "react";
import classes from "./landing.module.css";
import { store } from "../../store";
import { setCurrentUser, addError, removeError } from "../../store/actions";
import decode from "jwt-decode";
import { Link, animateScroll as scroll } from "react-scroll";
if (localStorage.loginToken) {
  // setToken(localStorage.jwtToken);
  try {
    const data = decode(localStorage.loginToken);
    const finalData = {
      name: data.name,
      username: data.username,
      email: data.email,
    };
    store.dispatch(setCurrentUser(finalData));
    store.dispatch(removeError());
  } catch (err) {
    store.dispatch(setCurrentUser({}));
    store.dispatch(addError());
  }
}


const Landing = (props) => {
  return (
    <div className={classes.container}>
      <section className={classes.glass}>
        <div className={classes.dashboard}>
          <div
            className={classes.logo}
            onClick={() => props.history.push("/login")}
          >
            <img src="./images/voting-box.png" alt="" />
            <h3>Evoting</h3>
          </div>
          <div className={classes.links}>
            <div className={classes.link}>
              <h2>Home</h2>
            </div>
            <div className={classes.link}>
              <h2>Menu</h2>
            </div>
            <div className={classes.link}>
              <h2>Help</h2>
            </div>
            <div className={classes.link}>
              <h2>Support</h2>
            </div>
          </div>
          <div className={classes.pro}>
            <h2>Join to support your parties</h2>
            <img src="./images/political-party.png" alt="" />
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.status}>
            <h1>
              <strong>E-Voting Using Blockchain</strong>
            </h1>
          </div>
          <div className={classes.cards}>
            <div
              className={classes.card}
              onClick={() => props.history.push("/voter")}
            >
              <img src="./images/ballot.png" alt="" />
              <div className={classes.cardInfo}>
                <h2>Apply for Voter</h2>
              </div>
            </div>

            <div
              className={classes.card}
              onClick={() => props.history.push("/candidate")}
            >
              <img src="./images/employee.png" alt="" />
              <div className={classes.cardInfo}>
                <h2>Apply for Candidate</h2>
              </div>
            </div>
            <div
              className={classes.card}
              onClick={() => props.history.push("/result")}
            >
              <img src="./images/stadistics.png" alt="" />
              <div className={classes.cardInfo}>
                <h2>Show results</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Landing;

