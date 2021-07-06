老师切换课件：
    切换到黑板：["whiteboard_data",[0,0,-1,"!load-slides",["draftboard",1,1,"draftboard"],true]]
    切换到pdf:  ["whiteboard_data",[0,0,-1,"!load-slides",["e0cf47fa-b218-457c-ad4e-081c0fc99ce7",1,1,"e0cf47fa-b218-457c-ad4e-081c0fc99ce7"],true]]
    切换到课件：["whiteboard_data",[0,0,-1,"!load-slides",["696",1,1,"696"],true]]

课件切页：
    1：["whiteboard_data",[0,0,-1,"!switch-slide",[2],true]]
    2：["whiteboard_data",[0,0,-1,"zmlMessage",["showPage",2]]]
    3：["whiteboard_page",2,"696"] // 获取当前页历史白板
    4：["whiteboard_data",[0,0,-1,"zmlMessage",["setMediaModal",{"url":null,"type":"image","showModal":false}]]]
    5：["whiteboard_data",[0,0,-1,"zmlMessage",["mediaOperation",{"mediaId":9863638,"during":0,"state":false,"volumn":1,"fullscreen":false}]]]

pdf切页：
    1：["whiteboard_data",[0,0,-1,"!switch-slide",[2],true]]
    2：["whiteboard_page",2,"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b"] //获取当前页历史白板

黑板切页：
    1:["whiteboard_data",[0,0,-1,"!switch-slide",[2],true]]
    2:["whiteboard_page",2,"draftboard"] // 获取当前页黑板历史数据

课中进入课堂：
e:current_whiteboard_data 
r:  [
        {
        "success":true,
        "data":{
            "currentLoad":"draftboard",
            "sliderCurrentPage":{"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b":2,"696":2,"draftboard":2}
            }
        }
    ]
e:["whiteboard_data",[0,0,-1,"!load-slides",["draftboard",1,1,"draftboard"],true]]
e:["whiteboard_page",2,"draftboard"] // 获取当前页历史白板数据


白板页数id:
pdf： aa6643c7-5b2a-4825-bfa2-b5c09218bb4b_0
黑板：draftboard_3
zml:696_2



接收老师切换到zml 
    r:["whiteboard_data",{"data":[0,0,-1,"!load-slides",["696",1,1,"696"],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":35}]
    s:["whiteboard_page",2,"696"] //获取历史消息

接受老师切换到pdf
	r:["whiteboard_data",{"data":[0,0,-1,"!load-slides",["aa6643c7-5b2a-4825-bfa2-b5c09218bb4b",1,1,"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b"],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":36}]
	s:["whiteboard_page",2,"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b"]
接受老师切换到黑板
	r:["whiteboard_data",{"data":[0,0,-1,"!load-slides",["draftboard",1,1,"draftboard"],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":40}]
	s:["whiteboard_page",3,"draftboard"]

接受老师黑板翻页：
	r:["whiteboard_data",{"data":[0,0,-1,"!switch-slide",[4],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":41}]
	s:["whiteboard_page",4,"draftboard"]

接受老师zml翻页
	r:["whiteboard_data",{"data":[0,0,-1,"!switch-slide",[4],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":47}]
	s:["whiteboard_page",4,"696"]
	r:["whiteboard_data",{"data":[0,0,-1,"zmlMessage",["showPage",4]],"operatorId":"1426717601","operatorRole":"TEACHER","seq":48}]
	r:["whiteboard_data",{"data":[0,0,-1,"zmlMessage",["setMediaModal",{"url":null,"type":"image","showModal":false}]],"operatorId":"1426717601","operatorRole":"TEACHER","seq":49}]
	r:["whiteboard_data",{"data":[0,0,-1,"zmlMessage",["mediaOperation",{"mediaId":6413274,"during":0,"state":false,"volumn":1,"fullscreen":false}]],"operatorId":"1426717601","operatorRole":"TEACHER","seq":50}]
接受老师pdf翻页：
	r:["whiteboard_data",{"data":[0,0,-1,"!switch-slide",[3],true],"operatorId":"1426717601","operatorRole":"TEACHER","seq":61}]
	s:["whiteboard_page",3,"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b"]

中途进入课堂：
	s:current_whiteboard_data
	r:{"success":true,"data":{"currentLoad":"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b","sliderCurrentPage":{"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b":3,"696":4,"draftboard":4}}}]
	s:["whiteboard_page",3,"aa6643c7-5b2a-4825-bfa2-b5c09218bb4b"]
	r:





