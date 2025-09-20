import { useReadContract } from 'wagmi';
import { Link } from 'react-router-dom';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';

interface ProposalCardProps {
  proposalId: bigint;
}

const ProposalStatus = ({ startTime, endTime }: { startTime: bigint, endTime: bigint }) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now < startTime) {
        return <span className="bg-yellow-600 text-xs font-bold mr-2 px-2.5 py-0.5 rounded">Upcoming</span>;
    } else if (now >= startTime && now < endTime) {
        return <span className="bg-green-600 text-xs font-bold mr-2 px-2.5 py-0.5 rounded">Active</span>;
    } else {
        return <span className="bg-red-600 text-xs font-bold mr-2 px-2.5 py-0.5 rounded">Ended</span>;
    }
};

const ProposalCard = ({ proposalId }: ProposalCardProps) => {
  const { data: proposal, isLoading } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'getProposal',
    args: [proposalId],
  });

  if (isLoading || !proposal) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
    );
  }

  const [id, title, description, startTime, endTime, totalVotes] = proposal;

  return (
    <Link to={`/proposal/${id.toString()}`} className="block bg-gray-800 hover:bg-gray-700/50 p-6 rounded-lg shadow-lg transition duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold truncate">{title}</h2>
        <ProposalStatus startTime={startTime} endTime={endTime} />
      </div>
      <p className="text-gray-400 text-sm line-clamp-3">{description}</p>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-300">Total Votes: <span className="font-semibold">{totalVotes.toString()}</span></p>
      </div>
    </Link>
  );
};

export default ProposalCard;
