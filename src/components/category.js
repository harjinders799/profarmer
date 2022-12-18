import * as React from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import {findIndex, flatten} from 'lodash';
import {useTheme} from '@react-navigation/native';
import {useAuth} from 'src/context/context';
import Text from 'src/components/text';
import Icon from 'src/components/icon';
import Modal from 'src/components/Modal';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Header from 'src/components/header';

export default function Category(props) {
  const {categories, setCat} = useAuth();
  const {colors} = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [addCat, setAddCat] = React.useState(false);
  const [catName, setCatName] = React.useState();
  const {selectedCat, setSelectedCat} = props;
  const [loading, setLoading] = React.useState(false);

  const onAdd = async () => {
    if (catName.trim() != '' && catName) {
      setLoading(true);
      let cat = categories;
      var foundId = findIndex(categories, x => {
        return x == catName;
      });
      if (foundId > -1) {
        alert('this category already exist!!');
        setLoading(false);
      } else {
        cat.push(catName);
        setCat(flatten(cat));
        setLoading(false);
        setAddCat(false);
      }
    } else {
      alert('Category name not valid!');
    }
  };

  return (
    <View style={styles.screen}>
      {/* <Text secondary style={{ marginBottom: 4 }}>Category</Text> */}
      <TouchableOpacity
        style={[styles.cat]}
        onPress={() => setModalVisible(true)}>
        {selectedCat ? (
          <Text h4 medium>
            {selectedCat}
          </Text>
        ) : (
          <Input
            editable={false}
            placeholder="Category"
            style={{borderBottomWidth: 0}}
          />
        )}
        <Icon
          type="FontAwesome"
          name="chevron-down"
          size={14}
          color={colors.secondaryText}
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        // ratioHeight={0.9}
      >
        <View style={styles.modal}>
          <Header
            leftComponent={<Text>Choose</Text>}
            rightComponent={
              <Button
                label="+ Category"
                btnStyle={[styles.btn, {height: 30}]}
                txtStyle={{fontSize: 12}}
                onPress={() => setAddCat(!addCat)}
              />
            }
          />
          {addCat ? (
            <>
              <Input
                placeholder="Category Name"
                value={catName}
                autoCapitalize="words"
                setValue={value => setCatName(value)}
              />
              <Button
                label="Add"
                btnStyle={styles.btn}
                onPress={() => onAdd()}
              />
            </>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={item => Math.random().toString(6).substr(2)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.list}
                  onPress={() => {
                    setSelectedCat(item);
                    setModalVisible(false);
                  }}>
                  <Text h3>{item}</Text>
                  {selectedCat == item && (
                    <Icon
                      type="MaterialIcons"
                      name="check"
                      size={25}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={{borderBottomWidth: StyleSheet.hairlineWidth}} />
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cat: {
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 13,
  },
  modal: {
    paddingHorizontal: 20,
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  btn: {
    width: '30%',
    height: 30,
    alignSelf: 'center',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
