import { useReadContract } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';

const ProposalResults = ({ proposalId }: { proposalId: bigint }) => {
  const { data: proposal } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'getProposal',
    args: [proposalId],
  });

  const { data: results, isLoading } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'getProposalResults',
    args: [proposalId],
  });

  if (isLoading || !results || !proposal) return <div>Loading results...</div>;

  const optionDescriptions = proposal[6];
  const totalVotes = Number(proposal[5]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="space-y-3">
        {optionDescriptions.map((option: string, index: number) => {
          const voteCount = Number(results[index]);
          const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0;
          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{option}</span>
                <span>{voteCount} Votes ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProposalResults;
