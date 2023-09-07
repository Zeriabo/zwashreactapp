// reducers/index.js
import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import stationReducer from "../slices/stationsSlice";
import serviceProviderReducer from "../slices/serviceProvidersSlice";
import programReducer from "../slices/programsSlice";
const rootReducer = combineReducers({
  user: userReducer,
  station: stationReducer,
  serviceProvider: serviceProviderReducer,
  programs: programReducer,
});

export default rootReducer;
