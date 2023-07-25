import { Button, Divider } from "@mui/material";
import Dexie, { Table } from "dexie";
import AppPageWrapper from "./AppPageWrapper";
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AsideBar from "./AsideBar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import TabBar from "./TabBar";


export interface Friend {
    id?: number;
    name: string;
    age: number;
}

export class MySubClassedDexie extends Dexie {
// 'friends' is added by dexie when declaring the stores()
// We just tell the typing system this is the case
    friends!: Table<Friend>; 

    constructor() {
        super('myThirdDatabase');
        this.version(2).stores({
        friends: '++id, name, age' // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();

function generateRandomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function addFriend(db: MySubClassedDexie) {
    try {
        const id = await db.friends.add({
            name: generateRandomString(10000),
            age: 0
        });

    } catch (error) {
        console.error(error)
    }
}












const AppView = () => {
    const dispatch = useDispatch();
    const storeEmailValue = useSelector((state: RootState) => state.user.email);

    const tabs = useSelector((state: RootState) => state.app.tabs);
    const activeTab = useSelector((state: RootState) => state.app.activeTab);
    const searchResults = useSelector((state: RootState) => state.app.searchResults);

    // useEffect(()=> {
    //     const db = new Dexie('myThirdDatabase');
    //     db.version(2).stores({
    //         friends: '++id, name, age', // Primary key and indexed props
    //     });

    //     for (let index = 0; index < 10000; index++) {
    //         addFriend(db as MySubClassedDexie)            
    //     }
    // }, [])
    
    return ( 
        <>
            <AppPageWrapper>
                <div className="flex flex-row w-full h-full">
                    <AsideBar/>
                    {/* container for right side */}
                    <div className="grow flex flex-col w-full h-full">
                        <TabBar/>
                        <div>

                        </div>
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        {/* <h1>App Page</h1>
                        <Button onClick={async ()=> {
                            let time = Date.now();
                            const db = new Dexie('myThirdDatabase') as MySubClassedDexie;
                            db.version(2).stores({
                                friends: '++id, name, age', // Primary key and indexed props
                            });
                            
                            let arr = await db.friends.toArray()
                            
                            console.log("data", arr)
                            console.log("time", Date.now() - time, "ms")
                        }}>Load data</Button> */}
                    </div>
                </div>
            </AppPageWrapper>
        </> 
    );
}
 
export default AppView;







































let loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac nisi efficitur, faucibus dui quis, semper elit. Suspendisse mattis eros non fringilla condimentum. Sed viverra tincidunt lacus, et eleifend ex venenatis id. Aenean quis odio eu neque bibendum ultrices. Curabitur massa erat, semper at vestibulum sit amet, malesuada non ex. Quisque facilisis urna ut mi interdum luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ornare, neque eget aliquet hendrerit, quam ipsum porttitor tellus, ultrices malesuada nunc nisi et velit. Aenean cursus, erat a bibendum malesuada, neque nisi viverra velit, vel auctor tellus magna eget turpis. Duis porta, dui vel venenatis venenatis, metus tortor auctor sapien, non luctus massa dolor ultrices massa. Morbi molestie lorem vitae maximus condimentum. Vivamus vitae libero lectus. Sed in euismod ex. Nullam nulla ante, sollicitudin porttitor malesuada condimentum, aliquam sit amet nibh.

Nulla id turpis eget risus venenatis consectetur. Sed sed molestie mauris. Curabitur scelerisque nunc eu nibh tempus tristique. Praesent et semper quam. Donec bibendum sollicitudin convallis. Praesent molestie augue tortor, non facilisis urna consequat id. Fusce sit amet tincidunt enim. Quisque tristique, lectus et imperdiet placerat, mauris lectus iaculis sapien, eu interdum velit nunc non turpis. Etiam tincidunt interdum neque, vitae mollis turpis volutpat vitae. Nullam mauris turpis, feugiat eget maximus scelerisque, malesuada a enim. Pellentesque elementum nisi quis massa tempor euismod. Donec mattis sapien ac volutpat fringilla. Pellentesque vitae gravida nulla. Suspendisse sapien metus, facilisis sed dignissim ut, tincidunt sit amet tortor. Nam convallis vestibulum purus quis posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus.

In mattis sem euismod, cursus libero in, accumsan nunc. Phasellus molestie nulla quis metus tristique feugiat. Integer eleifend libero in pretium fermentum. Sed nec egestas nunc, at tincidunt sem. Aliquam erat volutpat. Aenean a orci vitae orci gravida mollis in vitae quam. Aenean et tortor quis sapien dapibus efficitur hendrerit imperdiet felis. Cras condimentum nisl diam, non aliquam elit condimentum sed.

Aenean maximus sagittis luctus. Donec consectetur ut dolor in interdum. Quisque tincidunt suscipit sem vitae sodales. Donec nec semper ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam ultrices pharetra mauris sit amet mollis. In eu diam nisi. Praesent fringilla nec nisi sed malesuada. Sed efficitur consectetur justo vel sagittis. Duis eget egestas nisl. Phasellus id egestas libero. Aenean efficitur commodo nisi id dignissim. Pellentesque lacinia sit amet lectus sit amet varius.

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent viverra mattis arcu, sed pharetra sapien tincidunt vitae. Aliquam tristique scelerisque accumsan. Quisque consequat justo non egestas dignissim. Curabitur condimentum, risus eget tincidunt cursus, lorem magna tincidunt tortor, a pharetra neque metus sed enim. Aliquam et nunc eget arcu luctus volutpat vitae eget purus. Praesent gravida magna eget lectus blandit hendrerit. Curabitur in urna id nisl vulputate efficitur ut a lorem. Sed feugiat pellentesque purus, ac condimentum nulla vulputate in. Fusce sit amet augue rutrum, ultricies est sed, imperdiet enim. In hac habitasse platea dictumst. Nam pulvinar vulputate leo sed gravida. Nulla non magna at metus volutpat dapibus. Nullam eget pharetra felis, in tincidunt leo. Nunc id gravida nunc. Phasellus eget auctor tellus.

Pellentesque mollis ex nunc, vitae tempus urna molestie viverra. Vestibulum id velit id est volutpat rutrum id vel leo. Cras ac nulla ante. Duis luctus ligula et fermentum fermentum. Mauris gravida varius vehicula. Maecenas mollis quis elit sit amet fringilla. Maecenas finibus diam sed leo commodo, at sagittis lectus dignissim.

Fusce sagittis dapibus arcu quis mattis. Mauris turpis ipsum, accumsan ac sem non, rhoncus aliquam elit. Nulla imperdiet libero non turpis laoreet rhoncus. Cras eget volutpat metus. Cras non condimentum massa, at mollis leo. Donec luctus metus nisi, nec consectetur purus porttitor in. Etiam pretium sodales magna, non sodales libero imperdiet vitae. Mauris tempor sed arcu nec feugiat. Aliquam dictum, nisi non eleifend consectetur, leo tortor vulputate ante, id gravida justo nulla eget arcu. Praesent nunc elit, egestas at rhoncus ac, accumsan quis sapien. Nam vitae egestas diam, vel convallis odio. Mauris enim sem, egestas id vulputate eu, ullamcorper eget libero. Nulla pulvinar dolor sit amet faucibus iaculis. Phasellus nulla enim, blandit venenatis diam ac, blandit hendrerit lorem. Fusce euismod lectus metus, ac malesuada erat efficitur sit amet. Cras odio tellus, lacinia quis libero quis, rutrum malesuada arcu.

Quisque orci ex, laoreet sit amet feugiat nec, facilisis eu lectus. Donec non porttitor felis, vel ultricies felis. Suspendisse vulputate nibh sit amet justo tristique, at dapibus magna fringilla. Nullam tempus justo a neque congue, eget dapibus turpis dictum. Sed maximus vestibulum tortor, eget elementum sem eleifend in. Maecenas lacus nisl, hendrerit sed dignissim finibus, dictum et libero. Vivamus pharetra sapien ligula. Maecenas pretium nibh ac purus consequat, vitae mattis purus venenatis. Fusce placerat nisi commodo nunc eleifend dapibus.

In hac habitasse platea dictumst. Donec luctus orci et condimentum aliquam. Nunc at velit eros. In facilisis velit a ipsum posuere blandit. Aliquam consequat, lacus tincidunt bibendum condimentum, neque nisl ultricies orci, at molestie mi libero in dui. Fusce sit amet molestie ante, at posuere lacus. Sed et velit porttitor, imperdiet lacus at, aliquet ipsum.

Vivamus commodo congue erat sit amet fringilla. Maecenas ultricies, lorem pulvinar elementum sagittis, diam mauris porttitor turpis, id volutpat libero nibh quis enim. Praesent vestibulum sagittis augue. Donec ornare cursus nulla, a ultrices quam ullamcorper id. Sed laoreet, mi ut auctor consectetur, arcu nisi pellentesque sem, sit amet egestas ex ante id magna. Maecenas quis augue ac metus bibendum malesuada. Vestibulum nec leo mollis, consectetur mi eu, maximus tortor. Curabitur pulvinar sagittis gravida. Cras neque nisl, ultricies et facilisis a, pellentesque at neque. Integer posuere sapien ac diam faucibus lobortis. Maecenas efficitur eros neque, a molestie magna vestibulum vel. Sed id justo vitae nibh luctus egestas. Etiam a bibendum velit. Ut ut varius lectus, porta aliquet lectus. In at ornare sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras condimentum nunc quis leo tincidunt varius. Nunc tincidunt velit accumsan vulputate venenatis. Sed commodo facilisis ipsum.`