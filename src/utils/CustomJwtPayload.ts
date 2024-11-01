import { JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  authorities: authority[];
}

interface authority {
  authority: string;
}
export default CustomJwtPayload;
