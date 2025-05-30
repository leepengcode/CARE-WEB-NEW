import { useStateContext } from "../../contexts/ContextProvider";
import LoginPrompt from "../LoginPrompt";
import PageComponents from "../PageComponents";

export default function AddProperty() {
  const { userToken } = useStateContext();
  if (!userToken) return <LoginPrompt />;
  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <h1>My AddProperty</h1>
      </div>
    </PageComponents>
  );
}
