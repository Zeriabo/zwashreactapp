// reducers/index.js
import { combineReducers } from "redux";
import userReducer from "../slices/userSlice";
import stationReducer from "../slices/stationsSlice";

const rootReducer = combineReducers({
  user: userReducer,
  station: stationReducer,
});

export default rootReducer;
