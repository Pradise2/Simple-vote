
**`src/components/proposals/ProposalVoting.tsx`**
```tsx
import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';

const ProposalVoting = ({ proposalId }: { proposalId: bigint }) => {
  const { address } = useAccount();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  
  const { data: hash, writeContract } = useWriteContract();

  // Read proposal data to check voting status
  const { data: proposal } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'getProposal',
    args: [proposalId],
  });

  // Check if the current user has already voted
  const { data: hasVoted } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'hasVoted',
    args: [address, proposalId],
    enabled: !!address, // Only run this query if the user is connected
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const handleVote = () => {
    if (selectedOption === null) {
      setError('Please select an option to vote.');
      return;
    }
    setError('');
    writeContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: 'vote',
        args: [proposalId, selectedOption],
    });
  };

  const now = BigInt(Math.floor(Date.now() / 1000));
  const votingIsActive = proposal && now >= proposal[3] && now < proposal[4];

  if (hasVoted) return <div className="bg-gray-800 p-6 rounded-lg text-center"><p className="text-green-400">You have already voted on this proposal. Thank you!</p></div>;
  if (!votingIsActive) return <div className="bg-gray-800 p-6 rounded-lg text-center"><p className="text-yellow-400">The voting period for this proposal is not active.</p></div>;

  const optionDescriptions = proposal?.[6] || [];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cast Your Vote</h2>
      <div className="space-y-3">
        {optionDescriptions.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`w-full text-left p-3 rounded-md transition ${selectedOption === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {option}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      <button
        onClick={handleVote}
        disabled={isConfirming || selectedOption === null}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
      >
        {isConfirming ? 'Confirming vote...' : 'Submit Vote'}
      </button>
      {isConfirmed && <p className="text-green-400 mt-3 text-center">Vote submitted successfully!</p>}
    </div>
  );
};

export default ProposalVoting;
