import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getOrCreateUser } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if(!userId) redirect('/sign-in')

  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      console.log("No user found, redirecting to sign-in");
      redirect('/sign-in');
    }

    return (
      <>
        <Header 
          title={transformation.title}
          subtitle={transformation.subTitle}
        />
      
        <section className="mt-10">
          <TransformationForm 
            action="Add"
            userId={user._id}
            type={transformation.type as TransformationTypeKey}
            creditBalance={user.creditBalance}
          />
        </section>
      </>
    )
  } catch (error) {
    console.error("Error in AddTransformationTypePage:", error);
    redirect('/sign-in');
  }
}

export default AddTransformationTypePage