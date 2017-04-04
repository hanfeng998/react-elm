import { connect } from "react-redux";
import { addGeo } from "../actions";
import Msite from "../../pages/msite/msite";

const mapStateToProps = state => {
  const { shared } = state;
  return {
    geoHash: shared.geoHash,
    latitude: shared.latitude,
    longitude: shared.longitude
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddGeo: geo => {
      dispatch(addGeo(geo));
    }
  };
};

const posMsite = connect(mapStateToProps, mapDispatchToProps)(Msite);

export default posMsite;
