import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import AddUser from './AddUser';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';
import {
    StyleSheet,
    Text,
    TextInput,
    ImageBackground,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';


const db = openDatabase(
    { name: 'sql.db', createFromLocation: '~mysql.db' },
    () => {
        console.log('Connection success!');
    },
    error => {
        console.log('Connection error');
    },
);
export default function Home({ navigation }) {
    const [list, setList] = useState([]);
    const [text, setText] = useState('');
    const [temp, setTemp] = useState(null);
    const [visible, setVisible] = useState(false);
    const [indexCurrent, setIndexCurrent] = useState(null);
    useEffect(() => {
        creatable();
        getData();
    }, []);

    const creatable = () => {
        const query = 'CREATE TABLE IF NOT EXISTS Users (id integer primary key not null, name text, age integer)';
        const param = [];
        db.transaction(txn => {
            txn.executeSql(query, param,
                (txn, result) => {
                    console.log('success');
                },

            );
        });
    };

    const searchData = val => {
        var query = "SELECT * FROM Users WHERE name LIKE '%" + val + "%'";
        var params = [];
        db.transaction(txn => {
            txn.executeSql(
                query,
                params,
                (txn, results) => {
                    if (results.rows.length > 0) {
                        let array = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            console.log(results.rows.item(i));
                            let item = results.rows.item(i);
                            array.push({ id: item.id, name: item.name, age: item.age });
                        }
                        setList(array);
                    } else {
                        setList([]);
                    }
                },
                function (txn, err) {
                    alert('warning');
                    return;
                },
            );
        });
    };

    const delDB = id => {
        var query = 'delete from Users where id = ?';
        var params = [id];
        db.transaction(txn => {
            txn.executeSql(
                query,
                params,
                (txn, results) => {
                    alert('delete success');
                },
                function (txn, err) {
                    return;
                },
            );
        });
    };

    const getData = () => {
        var query = 'SELECT * from Users';
        var params = [];
        db.transaction(txn => {
            txn.executeSql(
                query,
                params,
                (txn, results) => {
                    if (results.rows.length > 0) {
                        let array = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            console.log(results.rows.item(i));
                            let item = results.rows.item(i);
                            array.push({ id: item.id, name: item.name, age: item.age });
                        }
                        console.log(array);
                        setList(array);
                    }
                },
                function (txn, err) {
                    alert('Can not get data');
                    return;
                },
            );
        });
    };
    let updateSearch = async value => {
        setText(value);
        await searchData(value);
    };
    const Load = async () => {
        await searchData(text);
    };
    let deleteColumn = async value => {
        await delDB(value);
        searchData(text);
    };
    const handleAdd = () => {
        navigation.replace('AddUser', { list });
    };
    const handleDelete = async value => {
        await deleteColumn(value);
    };

    return <View style={styles.container}>

        <Text style={styles.Text}>INFORMATION</Text>
        <View style={{ flex: 7 }}>
            <ScrollView>
                {list.map((item, index) =>
                    <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            setIndexCurrent(index === indexCurrent ? null : index)}
                        style={styles.cardContainer}
                    >
                        <View style={styles.card}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        flex: 3
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 25,
                                            fontWeight: "bold",
                                            color: "#FDFEFE",
                                            padding: 10
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        alignSelf: "center",
                                        alignItems: "flex-end",
                                        flexDirection: "row",
                                        flex: 1
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setVisible(true);
                                            setTemp(item);
                                        }}
                                    >
                                        <Image
                                            style={{ height: 25, width: 25, marginRight: 10 }}
                                            source={require('../Image/pencil.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleDelete(item.id);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height: 30,
                                                width: 30
                                            }}
                                            source={require('../Image/trash-bin.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {index === indexCurrent &&
                                <View style={styles.item}>
                                    <Text style={{ fontSize: 18, alignSelf: "center" }}>
                                        Name: {item.name}
                                    </Text>
                                    <Text style={{ fontSize: 18, alignSelf: "center" }}>
                                        Age: {item.age}
                                    </Text>
                                </View>}
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={handleAdd} style={styles.TouchableOpacityStyle}>
            <Image source={require('../Image/plus.png')} style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
        <PopUp visible={visible} item={temp !== null ? temp : { name: "" }} setVisible={setVisible} text={text} SearchData={Load} />
    </View>;
}



const styles = StyleSheet.create({
    container: {
        backgroundColor:'#FDFEFE',
        flex: 1,
    },
    image: {
        flex: 1,
    },
    Text: {
        fontSize: 35,
        color:'#F7A8F8 ',
        marginTop:10,
        fontWeight: 'bold',
        alignSelf: 'center',
        flex: 1,
    },
    card: {
        flex: 7,
    },
    TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 70,
        height: 70,
    },
    cardContainer: {
        borderColor: '#D0D3D4',
        borderWidth:1,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#ffcccc',
        borderRadius: 15,
        marginHorizontal: 30,
        flex: 1,
    },
});