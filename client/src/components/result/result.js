import React ,{useState , useEffect, Component} from "react";
import VotingContract from "../../contracts/Voting.json";
import getWeb3 from "../../getWeb3";
import decode from "jwt-decode";

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
    name:"",
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
      console.log("hello");
      for (let i = 0; i <= this.state.totalCandidate - 1; i++) {
        const data = await this.state.contract.methods
          .candidateAddress(i)
          .call();
        this.state.candidates.push(data);
      }
   
      this.state.candidates.forEach(async (value) => {
        let votes = await this.state.contract.methods.votesRecieved(value).call();
        this.state.candidateVotes.push(votes);

      
      });
      if (this.state.candidateVotes.length !== 0) {
        
        console.log(this.state.candidateVotes);
      }
      console.log(this.state.candidates);
      // console.log(this.state.candidateVotes);
    } catch (error) {
      console.error(error);
    }
  };


 
  render() {
    
    return (
      <div>
            hello
        </div>
    )
  }
}


export default (Result)
