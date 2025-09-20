
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';

// Zod schema for form validation
const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  options: z.array(z.object({
    value: z.string().min(1, 'Option cannot be empty')
  })).min(2, 'Must have at least two options'),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

const CreateProposalForm = () => {
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 60,
      options: [{ value: 'Yes' }, { value: 'No' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const onSubmit = (data: ProposalFormData) => {
    const durationInSeconds = data.duration * 60;
    const optionDescriptions = data.options.map(opt => opt.value);
    
    writeContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: 'createProposal',
        args: [data.title, data.description, durationInSeconds, optionDescriptions],
    });
  };

  if (isConfirmed) {
      // Maybe show a success message and then reset form
      // alert('Proposal created successfully!');
      // reset(); // uncomment to reset form after success
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg space-y-6">
      <div>
        <label htmlFor="title" className="block mb-2 font-semibold">Title</label>
        <input id="title" {...register('title')} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-semibold">Description</label>
        <textarea id="description" {...register('description')} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block mb-2 font-semibold">Voting Duration (in minutes)</label>
        <input id="duration" type="number" {...register('duration')} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
      </div>

      <div>
        <label className="block mb-2 font-semibold">Options</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <input
              {...register(`options.${index}.value`)}
              className="flex-grow bg-gray-700 border border-gray-600 rounded p-2"
            />
            <button type="button" onClick={() => remove(index)} className="bg-red-600 px-3 py-2 rounded">X</button>
          </div>
        ))}
        {errors.options && <p className="text-red-500 text-sm mt-1">{errors.options.message}</p>}
        <button type="button" onClick={() => append({ value: '' })} className="mt-2 bg-gray-600 px-4 py-2 rounded">Add Option</button>
      </div>

      <button type="submit" disabled={isConfirming} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 font-bold py-3 px-4 rounded">
        {isConfirming ? 'Creating Proposal...' : 'Create Proposal'}
      </button>
      {isConfirmed && <p className="text-green-400 mt-3 text-center">Proposal created successfully!</p>}
    </form>
  );
};

export default CreateProposalForm;
