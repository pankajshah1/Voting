import React ,{useState , useEffect, Component} from "react";
import VotingContract from "../../contracts/Voting.json";
import getWeb3 from "../../getWeb3";
import decode from "jwt-decode";
import Chart from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";


class Result extends Component{
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
      });
      for (let i = 0; i <= this.state.totalCandidate - 1; i++) {
        const data = await this.state.contract.methods
          .candidateAddress(i)
          .call();
        this.state.candidates.push(data);
      }
   
      this.state.candidates.forEach(async (value) => {
        let votes = await this.state.contract.methods.votesRecieved(value).call();
        this.state.candidateVotes.push(parseInt("10"));

      
      });
      console.log(this.state.candidateVotes.length);
    
    } catch (error) {
      console.error(error);
    }
  };

  resultDisplay = () => {
     
      console.log(this.state.candidates);

    console.log(this.state.candidateVotes);
    
    
  }


 
  render() {

    let display;
    if (this.state.voteStatus == 0) {
      display = <div> vote has not started yet</div>;
    } else if (this.state.voteStatus == 1) {
      display = (
        <div>
          {" "}
          <button onClick={this.resultDisplay}>click</button>
          <div style={{height:"400px" , width:"75vw"}}>
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
                  text: "Average Rainfall per month",
                  fontSize: 10,
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              }}
            />
          </div>
        </div>
      );
      console.log(this.state.candidateVotes);
    } else {
      display = (
        <div>
        </div>
      );
    }
    
    
    return (
      <div>
        {display}

      </div>
    );
  }
}


export default (Result)
