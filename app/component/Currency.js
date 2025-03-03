import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';

import colors from '../config/colors';
import getPrice from '../util/getPrice';
import {ms} from '../util/scale';
function Currency({
  item = {},
  theme,
  ticker = {},
  usdInr,
  currency,
  setRefresh = () => {},
  setData = () => {},
  deleteCrypto = () => {},
  removeSub = () => {},
}) {
  const styles = createStyles(theme);
  let percent = 0;
  let profit = 0;
  let dailyPer = 0;
  if (item.quantity * item.buyPrice && ticker[item.id]) {
    profit = ticker[item.id]?.value - item.quantity * item.buyPrice;
    percent = (profit * 100) / (item.quantity * item.buyPrice);
    dailyPer =
      ((ticker[item.id]?.price - ticker[item.id].close) * 100) /
      ticker[item.id].close;
  }
  const [showAlert, setShowAlert] = React.useState(false);
  return (
    <>
      {showAlert && (
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Delete"
          message="Are you sure to delete this?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setRefresh(true);
            deleteCrypto();
            removeSub();
            setData([]);
            setRefresh(false);
            setShowAlert(false);
          }}
          onDismiss={() => setShowAlert(false)}
          contentContainerStyle={styles.alert}
          titleStyle={{color: colors[theme].white}}
          messageStyle={{color: colors[theme].white}}
          confirmButtonColor={colors[theme].red}
          cancelButtonColor={colors[theme].blue}
        />
      )}
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onLongPress={() => {
          Vibration.vibrate([0, 20]);
          setShowAlert(true);
        }}>
        <View style={styles.leftDetails}>
          <Text style={styles.leftTopBottomText}>
            {item.quantity +
              ' Qty.  •  Avg. ' +
              getPrice(item.buyPrice, usdInr, currency, 2)}
          </Text>
          <Text style={styles.leftMiddleText}>
            {item.name + ' (' + item.id + ')'}
          </Text>
          <Text style={styles.leftTopBottomText}>
            {'Invested ' +
              getPrice(item.quantity * item.buyPrice, usdInr, currency, 2)}
          </Text>
        </View>
        <View style={styles.rightDetails}>
          <Text
            style={{
              ...styles.rightTopBottomText,
              color: percent >= 0 ? colors[theme].green : colors[theme].red,
            }}>
            {(percent >= 0 ? '+' : '') + Number(percent).toFixed(2) + '%'}
          </Text>
          <Text
            style={{
              ...styles.rightMiddleText,
              color: profit >= 0 ? colors[theme].green : colors[theme].red,
            }}>
            {(profit >= 0 ? '+' : '') + getPrice(profit, usdInr, currency, 2)}
          </Text>
          <View style={styles.rightBottomContainer}>
            <Text style={styles.leftTopBottomText}>
              {'LTP ' +
                getPrice(ticker[item.id]?.price, usdInr, currency, 4) +
                ' '}
            </Text>
            <Text
              style={{
                ...styles.rightTopBottomText,
                color: dailyPer >= 0 ? colors[theme].green : colors[theme].red,
              }}>
              {'(' +
                (dailyPer >= 0 ? '+' : '') +
                Number(dailyPer).toFixed(2) +
                '%)'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const createStyles = theme =>
  StyleSheet.create({
    alert: {
      backgroundColor: colors[theme].primary,
    },
    container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      width: '100%',
      backgroundColor: colors[theme].primary,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftDetails: {
      flex: 1.3,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    rightDetails: {
      flex: 0.7,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    leftTopBottomText: {
      color: colors[theme].grey,
      fontSize: ms(14),
      paddingVertical: 8,
    },
    leftMiddleText: {
      color: colors[theme].white,
      fontSize: ms(18),
    },
    rightTopBottomText: {
      color: colors[theme].red,
      fontSize: ms(14),
      paddingVertical: 8,
    },
    rightMiddleText: {
      color: colors[theme].red,
      fontSize: ms(18),
    },
    rightBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Currency;
