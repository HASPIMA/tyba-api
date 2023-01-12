import ErrorResponse from './ErrorResponse';

export default interface DataResponse {
  data: any;
  errors: ErrorResponse[];
}
