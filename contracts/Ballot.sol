// contracts/Ballot.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "./NFTFactory.sol";

/// @title Voting with delegation.
contract Ballot {

    // Delegation event
    event hasDelegated(address _from, address _to, uint _weight);

    // Voting event
    event hasVoted(address _from, uint _proposal, uint _weight);

    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint delegated; // number of person having delegated to
        uint vote;   // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voterCount; // number of accumulated voters
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) private voters;

    // A dynamically-sized array of `Proposal` structs.
    bytes32 private proposalPitch;
    Proposal[] private proposals;

    // Reference to the NFTFactory contract
    NFTFactory nftFactory;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(address _nftFactoryAddress, bytes32 proposalPitchName, bytes32[] memory proposalNames) {
        // Linking this contract with the already deployed one NFTFactory
        nftFactory = NFTFactory(_nftFactoryAddress);

        chairperson = msg.sender;
        // voters[chairperson].weight = 1;
        voters[chairperson].weight = _computeVoteWeight(chairperson);

        proposalPitch = proposalPitchName;
        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voterCount: 0,
                voteCount: 0
            }));
        }
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) external {
        // assigns reference
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "Self-delegation is disallowed.");
        // Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // We found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }

        // Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        Voter storage delegate_ = voters[to];
        sender.weight += _computeVoteWeight(msg.sender);
        sender.voted = true;
        sender.delegate = to;
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voterCount += 1;
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
            delegate_.delegated += 1;
        }

        // Rising event
        emit hasDelegated(msg.sender, to, sender.weight);
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        sender.weight += _computeVoteWeight(msg.sender);
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voterCount += 1 + sender.delegated;
        proposals[proposal].voteCount += sender.weight;

        // Rising event
        emit hasVoted(msg.sender, proposal, sender.weight);
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }

    function getProposalPitch() public view returns (bytes32 _proposalPitch) {
        return proposalPitch;
    }

    function getProposalName(uint proposal) public view returns (bytes32 _name) {
        return proposals[proposal].name;
    }

    function getProposalVoterCount(uint proposal) public view returns (uint _voterCount) {
        return proposals[proposal].voterCount;
    }

    function getProposalVoteCount(uint proposal) public view returns (uint _voterCount) {
        return proposals[proposal].voteCount;
    }

    function getProposalCount() public view returns (uint _proposalCount) {
        return proposals.length;
    }

    function getVoterStatus(address _voter) public view returns (bool _voted) {
        return voters[_voter].voted;
    }

    function getVoterWeight(address _voter) public view returns (uint _weight) {
        Voter storage voter = voters[_voter];
        
        _weight = voter.weight;

        if(!voter.voted){
            _weight += _computeVoteWeight(_voter);
        } 

        return _weight;
    }

    function getVotedProposal(address _voter) public view returns (uint _proposal) {
        require(voters[_voter].voted, "You not voted.");

        // Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        while (voters[_voter].delegate != address(0)) {
            _voter = voters[_voter].delegate;

            // We found a loop in the delegation, not allowed.
            require(_voter != msg.sender, "Found loop in delegation.");
        }
        
        return voters[_voter].vote;
    }

    function _computeVoteWeight(address _voter) private view returns (uint _weight) {
        _weight = 0;

        // ID 1 -> 5pts
        if(nftFactory.doesOwnBadgeFromGivenDefinition(_voter, 0) == true){
            _weight += 5;
        } 
    
        // ID 2 -> 10pts
        if(nftFactory.doesOwnBadgeFromGivenDefinition(_voter, 1) == true){
            _weight += 10;
        } 

        return _weight;
    }
}