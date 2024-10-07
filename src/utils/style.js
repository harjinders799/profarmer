import { StyleSheet } from 'react-native';
import { borderLight } from './colors';

export const common = StyleSheet.create({
  /* Aligning items */
  rightAligned: { alignItems: 'flex-end' },
  leftAligned: { alignItems: 'flex-start' },
  centerAligned: { alignItems: 'center' },
  centerJustify: { justifyContent: 'center' },
  centerAlignedJustify: { alignItems: 'center', justifyContent: 'center' },
  topCenterAligned: { alignItems: 'center', justifyContent: 'flex-start' },
  bottomCenterAligned: { alignItems: 'center', justifyContent: 'flex-end' },

  /* Helper Text Styles */
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  textLeft: { textAlign: 'left' },
  full_h_W: {
    width: '100%',
    height: '100%',
  },
  row_center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row_start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row_top_start: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row_top_btw: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  row_bottom_btw: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  row_btw: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  row_evenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  body: {
    width: '100%',
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  modalBack: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  modalView: {
    padding: 30,
    margin: 20,
    borderRadius: 10,
    width: '90%',
  },
  card: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  underline: {
    borderBottomWidth: 0.4,
    width: '100%',
    paddingBottom: 10,
  },
  topline: {
    borderTopWidth: 1,
    width: '100%',
    paddingTop: 10,
  },
  lineSaperate: {
    height: 1,
    width: '100%',
    backgroundColor: borderLight
  },
});
