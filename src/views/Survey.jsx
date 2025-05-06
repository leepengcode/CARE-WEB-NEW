import { PlusCircleIcon } from '@heroicons/react/24/outline'
import PageComponents from '../components/PageComponents.jsx'
import SurveyListItem from '../components/SurveyListItem.jsx'
import TButton from '../components/core/TButton.jsx'
import { useStateContext } from '../contexts/ContextProvider.jsx'

export default function Surveys() {
  const { surveys } = useStateContext()
  console.log(surveys)

  const onClick = () => {
    console.log('On Delete click')
  }

  return (
    <PageComponents
      title="Surveys"
      buttons={
        <TButton color="green" to="/surveys/create">
          <PlusCircleIcon className="h-6 w-6 m-1" />
        </TButton>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onClick} />
        ))}
      </div>
    </PageComponents>
  )
}
