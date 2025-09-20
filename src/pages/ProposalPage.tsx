import { useParams } from 'react-router-dom';
import ProposalDetails from '../components/proposals/ProposalDetails';
import ProposalVoting from '../components/proposals/ProposalVoting';
import ProposalResults from '../components/proposals/ProposalResults';

const ProposalPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id || isNaN(Number(id))) {
    return <div className="text-center text-red-500">Invalid Proposal ID.</div>;
  }

  const proposalId = BigInt(id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <ProposalDetails proposalId={proposalId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProposalVoting proposalId={proposalId} />
        <ProposalResults proposalId={proposalId} />
      </div>
    </div>
  );
};

export default ProposalPage;
