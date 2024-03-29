import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function withRouter(Component: any) {
  const ComponentWithRouterProp = (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  };
  return ComponentWithRouterProp;
}
