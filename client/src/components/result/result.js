import React ,{useState , useEffect, Component} from "react";
import VotingContract from "../../contracts/Voting.json";
import getWeb3 from "../../getWeb3";
import decode from "jwt-decode";
import Chart from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";

function Winnerfunc(props) {

  const image = `uploads/${props.winner[0].citizenship}.jpg`
          return (
            <div className="col-sm" style={{ marginBottom: "20px" }}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  className="card-img-top"
                  src={image}
                  alt="Card image cap"
                  width="100px"
                  height="150px"
                />
                <div className="card-body">
                  <p className="card-text">{props.winner[0].name}</p>
                  <p className="card-text">Party: {props.winner[0].party}</p>
                  <p className="card-text">Votes : {props.winner[0].votes} (winner)</p>
                 
                </div>
              </div>
            </div>
          );
  
}

class Result extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    voteStatus: null,
    ballotAddress: "",
    accountAddress: "",
    totalVoter: null,
    totalCandidate: null,
    candidates: [],
    candidateVotes: [],
    winner: "",
    winnerObject: [],
  };

  componentDidMount = async () => {
    // this.setState({storageValue:20 , web3});
    const web3 = await getWeb3();
    try {
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      const sta = await instance.methods.state.call().call();
      const add = await instance.methods.ballotOfficialAddress.call().call();
      const voter = await instance.methods.totalVoter.call().call();
      const candidate = await instance.methods.totalCandidate.call().call();
      const win = await instance.methods.winner.call().call();

      this.setState({
        voteStatus: sta,
        web3,
        accounts,
        contract: instance,
        ballotAddress: add,
        accountAddress: accounts[0],
        totalVoter: voter,
        totalCandidate: candidate,
        storageValue: 20,
        winner: win,
        candidatesInfo: [],
      });
      for (let i = 0; i <= this.state.totalCandidate - 1; i++) {
        const data = await this.state.contract.methods
          .candidateAddress(i)
          .call();
        const dataa = await this.state.contract.methods
          .candRegister(data)
          .call();

        this.state.candidates.push(data);
        this.state.candidatesInfo.push(dataa);
      }

      this.state.candidates.forEach(async (value) => {
        let votes = await this.state.contract.methods
          .votesRecieved(value)
          .call();
        this.state.candidateVotes.push(parseInt(votes));
      });

      let winner_var = this.state.winner;
      console.log(winner_var);
      var winnerObject_var = this.state.candidatesInfo.filter(function (obs) {
        return obs.candAddress == winner_var;
      });
      this.state.winnerObject = winnerObject_var;
      console.log(this.state.candidatesInfo);
      console.log(this.state.winnerObject[0].citizenship);
    } catch (error) {
      console.error(error);
    }

    this.setState(this.state);
  };

  resultDisplay = () => {
    console.log(this.state.candidates);

    console.log(this.state.candidateVotes);
  };

  render() {
    console.log(this.state.winnerObject);

    let display;
    if (this.state.voteStatus == 0) {
      display = <div> vote has not started yet</div>;
    } else if (this.state.voteStatus == 1) {
      display = <div> vote is running</div>;
      console.log(this.state.candidateVotes);
    } else {
      display = (
        <div>
          {" "}
          <div style={{ height: "400px", width: "75vw", float: "left" }}>
            <Pie
              data={{
                labels: this.state.candidates,
                datasets: [
                  {
                    label: "Rainfall",
                    backgroundColor: [
                      "#B21F00",
                      "#C9DE00",
                      "#2FDE00",
                      "#00A6B4",
                      "#6800B4",
                    ],
                    hoverBackgroundColor: [
                      "#501800",
                      "#4B5000",
                      "#175000",
                      "#003350",
                      "#35014F",
                    ],
                    data: this.state.candidateVotes,
                  },
                ],
              }}
              options={{
                title: {
                  display: true,
                  text: "Voting Result",
                  fontSize: 10,
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              }}
            />
          </div>
          <div style={{ height: "400px", width: "20vw", float: "right" , marginTop:"50px" }}>
            <div>
              {this.state.winnerObject.length == 0 ? (
                <div>hello</div>
              ) : (
                <Winnerfunc winner={this.state.winnerObject} />
              )}
            </div>
          </div>
        </div>
      );
    }

    return <div>{display}</div>;
  }
}


export default (Result)
