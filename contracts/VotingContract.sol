// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AccessControl.sol";

/**
 * @title VotingContract
 * @dev A contract for creating and managing decentralized votes on proposals.
 * This contract combines proposal management and voting logic. The contract owner
 * serves as the administrator who can create proposals.
 */
contract VotingContract is AccessControl {

    /**
     * @dev Structure to hold all information about a single proposal.
     */
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 totalVotes;
        string[] optionDescriptions; // e.g., ["Yes", "No", "Abstain"]
        mapping(uint256 => uint256) votes; // Maps an option index to its vote count
    }

    // State variables
    uint256 private _proposalCounter;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted; // Tracks if an address has voted on a proposal

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        uint256 startTime,
        uint256 endTime
    );

    event Voted(
        address indexed voter,
        uint256 indexed proposalId,
        uint256 indexed optionIndex
    );


    // --- PROPOSAL MANAGEMENT ---

    /**
     * @dev Creates a new proposal. Can only be called by the owner (admin).
     * @param _title The title of the proposal.
     * @param _description A detailed description of the proposal.
     * @param _durationInSeconds The duration of the voting period in seconds from the time of creation.
     * @param _optionDescriptions A list of descriptions for the vote options (e.g., ["Yes", "No"]).
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _durationInSeconds,
        string[] memory _optionDescriptions
    ) external onlyOwner {
        require(_durationInSeconds > 0, "VotingContract: Duration must be positive");
        require(_optionDescriptions.length >= 2, "VotingContract: Must have at least two options");

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _durationInSeconds;
        
        _proposalCounter++;
        uint256 newProposalId = _proposalCounter;
        
        Proposal storage newProposal = proposals[newProposalId];
        newProposal.id = newProposalId;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.startTime = startTime;
        newProposal.endTime = endTime;
        
        for (uint i = 0; i < _optionDescriptions.length; i++) {
            newProposal.optionDescriptions.push(_optionDescriptions[i]);
        }

        emit ProposalCreated(newProposalId, _title, startTime, endTime);
    }


    // --- VOTING LOGIC ---

    /**
     * @dev Casts a vote on an active proposal.
     * @param _proposalId The ID of the proposal to vote on.
     * @param _optionIndex The index of the option to vote for.
     */
    function vote(uint256 _proposalId, uint256 _optionIndex) external {
        require(_proposalId > 0 && _proposalId <= _proposalCounter, "VotingContract: Proposal does not exist");
        require(!hasVoted[msg.sender][_proposalId], "VotingContract: You have already voted on this proposal");

        Proposal storage p = proposals[_proposalId];
        
        require(block.timestamp >= p.startTime, "VotingContract: Voting has not started yet");
        require(block.timestamp < p.endTime, "VotingContract: Voting has ended");
        require(_optionIndex < p.optionDescriptions.length, "VotingContract: Invalid option index");

        p.votes[_optionIndex]++;
        p.totalVotes++;
        hasVoted[msg.sender][_proposalId] = true;

        emit Voted(msg.sender, _proposalId, _optionIndex);
    }


    // --- VIEW FUNCTIONS ---

    /**
     * @dev Returns the total number of proposals created.
     */
    function getProposalCount() public view returns (uint256) {
        return _proposalCounter;
    }

    /**
     * @dev Retrieves the main details for a specific proposal.
     * @param _proposalId The ID of the proposal.
     * @return id The proposal ID.
     * @return title The proposal title.
     * @return description The proposal description.
     * @return startTime The voting start time (UNIX timestamp).
     * @return endTime The voting end time (UNIX timestamp).
     * @return totalVotes The total number of votes cast.
     * @return optionDescriptions The descriptions for the voting options.
     */
    function getProposal(uint256 _proposalId) 
        public 
        view 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            uint256 totalVotes,
            string[] memory optionDescriptions
        )
    {
        require(_proposalId > 0 && _proposalId <= _proposalCounter, "VotingContract: Proposal does not exist");
        Proposal storage p = proposals[_proposalId];
        return (p.id, p.title, p.description, p.startTime, p.endTime, p.totalVotes, p.optionDescriptions);
    }
    
    /**
     * @dev Retrieves the vote counts for every option of a given proposal.
     * @param _proposalId The ID of the proposal.
     * 