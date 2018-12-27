
const tesk = [
    {
      ids: "01",
      title: null,
      extend: true,
      tesk: [
        {
          id: "006",
          titles: "根据UI图，切项目管理中的任务列表及详情",
          star: true,
          pre: false,
          remind: true,
          state: 2,
          unreadNum: 2,
          teskPeopleNum: 6,
        },
        {
          id: "007",
          titles: "完成今天的计划",
          star: false,
          pre: true,
          remind: false,
          state: 1,
          unreadNum: 0,
          teskPeopleNum: 13
        },
        // {
        //   id: "2002",
        //   titles: "1.behavior 表示滚动方式。auto 表示使用当前元素的 scroll-behavior 样式。instant 和 smooth 表示 直接滚到底 和 使用平滑滚动。",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "12003",
        //   titles: "这个 CSS 属性就只接受两个自定义值：auto 和 smooth",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // }, 
        // {
        //   id: "12004",
        //   titles: "参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "21005",
        //   titles: "调用方法为 element.scrollIntoView() 参数默认为true。参数为true时调用该函数，页面（或容器）发生滚动，使element的顶部与视图（容器）顶部对齐；参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "2006",
        //   titles: "scrollIntoView可以说是URL中hash标记的进化，那么它在什么时候用到呢？想想hash（也就是#xxx）的作用吧！",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // },
        // {
        //   id: "112007",
        //   titles: "3.block 表示块级元素排列方向要滚动到的位置。对于默认的 writing-mode: horizontal-tb 来说，就是竖直方向。start 表示将视口的顶部和元素顶部对齐；center 表示将视口的中间和元素的中间对齐；end 表示将视口的底部和元素底部对齐；nearest 表示就近对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "12008",
        //   titles: "22222222222开会讨论文件及其他的功能，这是第一个分区的第二个任务",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "21009",
        //   titles: "这个 CSS 属性就只接受两个自定义值：auto 和 smooth",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // }, 
        // {
        //   id: "12010",
        //   titles: "参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "0011",
        //   titles: "调用方法为 element.scrollIntoView() 参数默认为true。参数为true时调用该函数，页面（或容器）发生滚动，使element的顶部与视图（容器）顶部对齐；参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // }
      ]
    },
    {
      ids: "02",
      title: "开发",
      extend: true,
      tesk: [
        {
          id: "1004",
          titles: "这是第二个分区的第一个任务",
          star: false,
          pre: false,
          remind: true,
          state: 1,
          unreadNum: 2,
          teskPeopleNum: 8
        },
        {
          id: "1005",
          titles: "开会讨论文件及其他的功能，这是第二个分区的第二个任务",
          star: true,
          pre: true,
          remind: false,
          state: 3,
          unreadNum: 0,
          teskPeopleNum: 10
        }
      ]
    },
    {
      ids: "03",
      title: "产品分区的内容",
      extend: true,
      tesk: [
        {
          id: "2001",
          titles: "11111111这是第一个分区的第一个任务",
          star: false,
          pre: false,
          remind: false,
          state: 4,
          unreadNum: 0,
          teskPeopleNum: 8
        },
        {
          id: "2002",
          titles: "1.behavior 表示滚动方式。auto 表示使用当前元素的 scroll-behavior 样式。instant 和 smooth 表示 直接滚到底 和 使用平滑滚动。",
          star: true,
          pre: true,
          remind: true,
          state: 2,
          unreadNum: 2,
          teskPeopleNum: 3
        },
        {
          id: "2003",
          titles: "这个 CSS 属性就只接受两个自定义值：auto 和 smooth",
          star: false,
          pre: true,
          remind: false,
          state: 3,
          unreadNum: 0,
          teskPeopleNum: 4
        }, 
        // {
        //   id: "2004",
        //   titles: "参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "2005",
        //   titles: "调用方法为 element.scrollIntoView() 参数默认为true。参数为true时调用该函数，页面（或容器）发生滚动，使element的顶部与视图（容器）顶部对齐；参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "2006",
        //   titles: "scrollIntoView可以说是URL中hash标记的进化，那么它在什么时候用到呢？想想hash（也就是#xxx）的作用吧！",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // },
        // {
        //   id: "2007",
        //   titles: "3.block 表示块级元素排列方向要滚动到的位置。对于默认的 writing-mode: horizontal-tb 来说，就是竖直方向。start 表示将视口的顶部和元素顶部对齐；center 表示将视口的中间和元素的中间对齐；end 表示将视口的底部和元素底部对齐；nearest 表示就近对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "2008",
        //   titles: "22222222222开会讨论文件及其他的功能，这是第一个分区的第二个任务",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "2009",
        //   titles: "这个 CSS 属性就只接受两个自定义值：auto 和 smooth",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // }, 
        // {
        //   id: "2010",
        //   titles: "参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: false,
        //   pre: false,
        //   remind: false,
        //   state: 4,
        //   unreadNum: 0,
        //   teskPeopleNum: 8
        // },
        // {
        //   id: "2011",
        //   titles: "调用方法为 element.scrollIntoView() 参数默认为true。参数为true时调用该函数，页面（或容器）发生滚动，使element的顶部与视图（容器）顶部对齐；参数为false时，使element的底部与视图（容器）底部对齐。",
        //   star: true,
        //   pre: true,
        //   remind: true,
        //   state: 2,
        //   unreadNum: 2,
        //   teskPeopleNum: 3
        // },
        // {
        //   id: "2012",
        //   titles: "scrollIntoView可以说是URL中hash标记的进化，那么它在什么时候用到呢？想想hash（也就是#xxx）的作用吧！",
        //   star: false,
        //   pre: true,
        //   remind: false,
        //   state: 3,
        //   unreadNum: 0,
        //   teskPeopleNum: 4
        // }
      ]
    }
  ];

const tesk1 = [
   
    {
        ids: "03",
        title: null,
        teskLength: 2,
      },
    {
        id: "001",
        titles: "11111111这是第一个分区的第一个任务",
        star: false,
        pre: false,
        remind: false,
        state: 4,
        unreadNum: 0,
        teskPeopleNum: 8
      },
      {
        id: "002",
        titles: "22222222222开会讨论文件及其他的功能，这是第一个分区的第二个任务",
        star: true,
        pre: true,
        remind: true,
        state: 2,
        unreadNum: 2,
        teskPeopleNum: 3
      },
      {
        ids: "01",
        title: "产品分区的内容",
        teskLength: 3,
      },
      {
        id: "003",
        titles: "333333333这是第一个分区的第三个任务",
        star: false,
        pre: true,
        remind: false,
        state: 3,
        unreadNum: 0,
        teskPeopleNum: 4
      },
     
      {
        id: "004",
        titles: "这是第二个分区的第一个任务",
        star: false,
        pre: false,
        remind: true,
        state: 1,
        unreadNum: 2,
        teskPeopleNum: 8
      },
      {
        id: "005",
        titles: "开会讨论文件及其他的功能，这是第二个分区的第二个任务",
        star: true,
        pre: true,
        remind: false,
        state: 3,
        unreadNum: 0,
        teskPeopleNum: 10
      },
      {
        ids: "02",
        title: "开发",
        teskLength: 2,
      },
      {
        id: "006",
        titles: "根据UI图，切项目管理中的任务列表及详情",
        star: true,
        pre: false,
        remind: true,
        state: 2,
        unreadNum: 2,
        teskPeopleNum: 6
      },
      {
        id: "007",
        titles: "完成今天的计划",
        star: false,
        pre: true,
        remind: false,
        state: 1,
        unreadNum: 0,
        teskPeopleNum: 13
      },


  ];

const file = [
    {
        "Pkid":"3423",
        "Title":"冯提莫 - 我要你 (Cover 任素汐)",
        "YimageUrl":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
        "Url":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
        "Titles":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"mp3",
        "Size":6262,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3423,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":true,
    },
    {
        "Pkid":"3422",
        "Title":"svg_study",
        "YimageUrl":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
        "Url":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
        "Titles":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"zip",
        "Size":5443,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3422,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":false,
    },
    {
        "Pkid":"3421",
        "Title":"P70428-131039",
        "YimageUrl":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710.jpg",
        "Url":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710_s1.jpg",
        "Titles":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710_s0.jpg",
        "ImageHeight":1080,
        "ImageWidth":800,
        "FileType":"jpg",
        "Size":0,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3421,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":true,
    },
    {
        "Pkid":"3420",
        "Title":"GoldenPhoenix",
        "YimageUrl":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
        "Url":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
        "Titles":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"rar",
        "Size":1250,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3420,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":false,
    },
    {
        "Pkid":"3419",
        "Title":"小韭菜接口",
        "YimageUrl":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
        "Url":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
        "Titles":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"docx",
        "Size":15,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3419,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":true,
    },
    {
        "Pkid":"3418",
        "Title":"功能文档(1)",
        "YimageUrl":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
        "Url":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
        "Titles":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"xlsx",
        "Size":15,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3418,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":false,
    },
    {
        "Pkid":"3417",
        "Title":"v2",
        "YimageUrl":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
        "Url":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
        "Titles":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"mp4",
        "Size":880,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3417,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05"
    },
    {
        "Pkid":"3416",
        "Title":"测试文本",
        "YimageUrl":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
        "Url":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
        "Titles":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"txt",
        "Size":0,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3416,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":false,
    },
    {
        "Pkid":"3415",
        "Title":"v1",
        "YimageUrl":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
        "Url":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
        "Titles":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
        "ImageHeight":0,
        "ImageWidth":0,
        "FileType":"mp4",
        "Size":287,
        "Uname":"祝建云",
        "Edition":"0",
        "GroupId":3415,
        "Groupedition":"0",
        "CreateTime":"2018年08月08日 18:05",
        "collect":true,
    }
    // ,

    // {
    //     "Pkid":"13423",
    //     "Title":"冯提莫 - 我要你 (Cover 任素汐)",
    //     "YimageUrl":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
    //     "Url":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
    //     "Titles":"/upload/file/20180808060528/f427b230-ae41-4fec-9353-eb48fd181c15/5e930d07-1f65-411c-9395-44ee2c19f27e.mp3",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"mp3",
    //     "Size":6262,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3423,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":true,
    // },
    // {
    //     "Pkid":"13422",
    //     "Title":"svg_study",
    //     "YimageUrl":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
    //     "Url":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
    //     "Titles":"/upload/file/20180808060526/d923de1f-257e-46b6-ad0f-765d399da087/c96a16ff-6987-4656-ae8b-35fcf472b69a.zip",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"zip",
    //     "Size":5443,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3422,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":false,
    // },
    // {
    //     "Pkid":"13421",
    //     "Title":"P70428-131039",
    //     "YimageUrl":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710.jpg",
    //     "Url":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710_s1.jpg",
    //     "Titles":"/upload/file/20180808060520/a927cba4-cf2c-4e01-b093-08763e21f52c/591f683c-6f8e-4e8f-81b9-26e122b42710_s0.jpg",
    //     "ImageHeight":1080,
    //     "ImageWidth":800,
    //     "FileType":"jpg",
    //     "Size":0,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3421,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":true,
    // },
    // {
    //     "Pkid":"13420",
    //     "Title":"GoldenPhoenix",
    //     "YimageUrl":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
    //     "Url":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
    //     "Titles":"/upload/file/20180808060508/4742895e-e157-427c-a8c8-bd23b69e2b6c/94ddfef5-e0d8-412d-8360-68556e05b207.rar",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"rar",
    //     "Size":1250,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3420,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":false,
    // },
    // {
    //     "Pkid":"13419",
    //     "Title":"小韭菜接口",
    //     "YimageUrl":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
    //     "Url":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
    //     "Titles":"/upload/file/20180808060507/dda7cb99-0d64-4d43-a1dd-4e0d1a891a76/d14c6cd2-8a9b-4ab2-a661-5b61a644d540.docx",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"docx",
    //     "Size":15,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3419,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":true,
    // },
    // {
    //     "Pkid":"13418",
    //     "Title":"功能文档(1)",
    //     "YimageUrl":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
    //     "Url":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
    //     "Titles":"/upload/file/20180808060506/fd2b20d9-2f5c-4933-a0f5-7d0dd72a06e0/89c1a9bd-cdf7-4c3d-b08f-4adfb97ae567.xlsx",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"xlsx",
    //     "Size":15,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3418,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":false,
    // },
    // {
    //     "Pkid":"13417",
    //     "Title":"v2",
    //     "YimageUrl":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
    //     "Url":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
    //     "Titles":"/upload/file/20180808060505/bf9b5fa5-670e-4355-ae67-1fae70f11b5b/77ea8a68-a637-4d61-813c-a256af7ba2c7.mp4",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"mp4",
    //     "Size":880,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3417,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05"
    // },
    // {
    //     "Pkid":"13416",
    //     "Title":"测试文本",
    //     "YimageUrl":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
    //     "Url":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
    //     "Titles":"/upload/file/20180808060502/9a8045db-9f09-46cb-9573-0ebcb7256996/f7bf0629-f3b1-4d06-bfe7-0a65960d6ac9.txt",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"txt",
    //     "Size":0,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3416,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":false,
    // },
    // {
    //     "Pkid":"13415",
    //     "Title":"v1",
    //     "YimageUrl":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
    //     "Url":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
    //     "Titles":"/upload/file/20180808060501/ed667a5c-d927-4019-94f6-06acebf75df3/b9441922-b180-4f0b-beff-837f327c8ac7.mp4",
    //     "ImageHeight":0,
    //     "ImageWidth":0,
    //     "FileType":"mp4",
    //     "Size":287,
    //     "Uname":"祝建云",
    //     "Edition":"0",
    //     "GroupId":3415,
    //     "Groupedition":"0",
    //     "CreateTime":"2018年08月08日 18:05",
    //     "collect":true,
    // }
];

const reply = [
    {
        "Pkid":"1525",
        "Content":"今日工作总结：<br />1、个人中心页面、安全设置、账号绑定页面做完",
        "UserName":"原娣",
        "Pic":"/upload/user/9019fe14-48e3-427c-9453-7131daf90501.png",
        "CreateTime":"2018年10月16日 21:19",
        "judgeExtend": false,
        "ref": "ref0",
        "judge": [
            {
                "Pkid":"1487",
                "Content":"项目管理列表操作动作",
                "UserName":"卢洪臣",
                "Pic":"/upload/user/20180719110629240.jpeg",
                "CreateTime":"2018年10月12日 09:59"
            },
            {
                "Pkid":"1495",
                "Content":"1012工作总结：<br />完成项目管理页面80%，剩余项目交接页面。<br />任务详情列表组件完成80%，剩余搜索组件的样式",
                "UserName":"卢洪臣",
                "Pic":"/upload/user/20180719110629240.jpeg",
                "CreateTime":"2018年10月12日 19:22"
            }
        ]
    },
    {
        "Pkid":"1531",
        "Content":"今日工作总结<br />已完成功能<br />1.项目管理页面->项目新建->空白项目<br />2.我负责的项目卡片功能 项目信息 归档 已完成 <br />3.我参与的项目卡片 项目信息已完成 <br />3.项目归档 项目卡片 项目信息 恢复 隐藏消失已完成 <br /><br />未完成<br />1.卡片功能 项目记录 分享 交接 人员添加 删除<br />",
        "UserName":"赵珂",
        "Pic":"/upload/user/20180719085213642.jpg",
        "CreateTime":"2018年10月17日 20:01",
        "judgeExtend": false,
        "ref": "ref1",
        "judge": []
    }
];

const log = [
    {
        "createTime":"2018-10-19 10:21:49",
        "userName":"原娣",
        "user2Name":"卢洪辰",
        "type": 4,//类型1
        "typeName":"进行评论", //类型1名称
        "type2":0, //类型2  5, 6有用
        "type2Name":"",
        "frontContent":"修改前信息",
        "backContent": "修改后信息",
        "addContent": "",
        "JumpId": "1",//当前信息的id  例如 评论id  回复信息id 上传文件Id
        "Jump2Id": "2",//父级id  例如 回复信息内容 id
        "extend": false,
    },
    {
        "createTime":"2018-10-19 10:21:49",
        "userName":"赵珂",
        "user2Name":"--",
        "type":3,
        "typeName":"修改了项目",
        "type2":1,
        "type2Name":"项目标题",
        "frontContent":"我负责的项目",
        "backContent": "我负责的项目 改111",
         "addContent": "上传信息",
        "JumpId": "1",//当前信息的id  例如 评论id  回复信息id 上传文件Id
        "Jump2Id": "2",//父级id  例如 回复信息内容 id
        "extend": false,

    },
    {
        "createTime":"2018-10-19 10:05:46",
        "userName":"赵珂",
        "user2Name":"--",
        "type":1,
        "typeName":"创建了项目",
        "type2":0,
        "type2Name":"未知",
        "frontContent":"",
        "backContent": "",
          "addContent": "上传信息",
        "JumpId": "1",//当前信息的id  例如 评论id  回复信息id 上传文件Id
        "Jump2Id": "2",//父级id  例如 回复信息内容 id
        "extend": false,

    }
];

const details = {
  createdId: '1184',
  unreadNum: 0,
  isStar: false,
  pre: false,
  title: 'newTesk',
  peoples: [],
  startTime: '',
  endTime: '',
  desc: '',
  replay: [],
  summaryFile: [],
  demandFile: [],
  log: []

};

const searchList = [
  {
    id: "006",
    titles: "根据UI图，切项目管理中的任务列表及详情",
    star: true,
    pre: false,
    remind: true,
    state: 2,
    unreadNum: 2,
    teskPeopleNum: 6,
    fromParth: '分区1',
    Images: "/upload/user/6ce20ef2-4141-40e2-9597-4f41c081495a.png"
  },
  {
    id: "002",
    titles: "22222222222开会讨论文件及其他的功能，这是第一个分区的第二个任务",
    star: true,
    pre: true,
    remind: true,
    state: 2,
    unreadNum: 2,
    teskPeopleNum: 3,
    fromParth: '分区2222',
    Images: "/upload/user/20180719085213642.jpg"
  },
  {
    id: "003",
    titles: "333333333这是第一个分区的第三个任务",
    star: false,
    pre: true,
    remind: false,
    state: 3,
    unreadNum: 0,
    teskPeopleNum: 4,
    fromParth: '分区33333333333333',
    Images: "/upload/user/20180717052232040.jpg"
  },
  {
    id: "2012",
    titles: "scrollIntoView可以说是URL中hash标记的进化，那么它在什么时候用到呢？想想hash（也就是#xxx）的作用吧！",
    star: false,
    pre: true,
    remind: false,
    state: 3,
    unreadNum: 0,
    teskPeopleNum: 4,
    fromParth: '分区33333333333333',
    Images: "/upload/user/20180717052232040.jpg"
  }
];

const preList = [
  {
    id: "006",
    titles: "根据UI图，切项目管理中的任务列表及详情",
    star: true,
    pre: false,
    remind: true,
    state: 2,
    unreadNum: 2,
    teskPeopleNum: 6,
    fromParth: '分区1',
    Images: "/upload/user/6ce20ef2-4141-40e2-9597-4f41c081495a.png",
    preType: 1,

  },
  {
    id: "002",
    titles: "22222222222开会讨论文件及其他的功能，这是第一个分区的第二个任务",
    star: true,
    pre: true,
    remind: true,
    state: 2,
    unreadNum: 2,
    teskPeopleNum: 3,
    fromParth: '分区2222',
    Images: "/upload/user/20180719085213642.jpg",
    preType: 2,


  },
  {
    id: "003",
    titles: "333333333这是第一个分区的第三个任务",
    star: false,
    pre: true,
    remind: false,
    state: 3,
    unreadNum: 0,
    teskPeopleNum: 4,
    fromParth: '分区33333333333333',
    Images: "/upload/user/20180717052232040.jpg",
    preType: 3,


  },
  {
    id: "007",
    titles: "完成今天的计划",
    star: false,
    pre: true,
    remind: false,
    state: 1,
    unreadNum: 0,
    teskPeopleNum: 13,
    fromParth: '分区3',
    Images: "/upload/user/20180717052232040.jpg",
    preType: 4,


  }
];
preList.map(ele => ele.checked = false);
const people = [
  {
    Pkid: "1189",
    Username: "18210525140",
    Realname: "罗建鹏",
    checked: true,
    Images: "/upload/user/6ce20ef2-4141-40e2-9597-4f41c081495a.png"
  },
  {
    Pkid: "1193",
    Username: "13401156831",
    Realname: "刘冉",
    checked: true,

    Images: "/upload/user/de54f1b2-7c55-47cb-8f87-f53f3c1436c6.png"
  },
  {
    Pkid: "1196",
    Username: "18600120960",
    Realname: "袁沛豪",
    checked: true,

    Images: "/upload/user/67c56166-c8c4-406f-85fb-dcf2637136a4.png"
  },
  {
    Pkid: "1204",
    Username: "13161232370",
    Realname: "赵珂",
    checked: false,

    Images: "/upload/user/20180719085213642.jpg"
  },
  {
    Pkid: "1184",
    Username: "15755028313",
    Realname: "祝建云",
    checked: false,

    Images: "/upload/user/20180717052232040.jpg"
  },
  {
    Pkid: "1194",
    Username: "13520123285",
    Realname: "李澄薇",
    checked: false,

    Images: "/upload/user/875b2f05-5cc1-4b84-9656-da307bbeeb03.png"
  },
  {
    Pkid: "1195",
    Username: "13146353585",
    Realname: "张瀚",
    checked: false,

    Images: "/upload/user/7f26c946-3301-4351-b4be-a6473c3e13f6.png"
  },
  {
    Pkid: "1325",
    Username: "danwang@apex.top",
    Realname: "王丹",
    checked: false,

    Images: "/upload/user/d8e8aa58-e1ea-47ce-9c48-5244a97f6af4.png"
  }
];

const friendList = [
  {
  pkid: 1,
  Realname: "EGGS项目",
  type: 1,
  checked: false,
  extend: true,
  children: [
      {
      pkid: "1189",
      Username: "18210525140",
      Realname: "罗建鹏",
      checked: false,
      isUsed: true,
      Images: "/upload/user/6ce20ef2-4141-40e2-9597-4f41c081495a.png"
      },
      {
      pkid: "1193",
      Username: "13401156831",
      Realname: "刘冉",
      checked: false,
      isUsed: false,

      Images: "/upload/user/de54f1b2-7c55-47cb-8f87-f53f3c1436c6.png"
      },
      {
      pkid: "1196",
      Username: "18600120960",
      Realname: "袁沛豪",
      checked: false,
      isUsed: true,

      Images: "/upload/user/67c56166-c8c4-406f-85fb-dcf2637136a4.png"
      },
      {
      pkid: "1204",
      Username: "13161232370",
      Realname: "赵珂",
      checked: false,
      isUsed: true,

      Images: "/upload/user/20180719085213642.jpg"
      },
      {
      pkid: "1184",
      Username: "15755028313",
      Realname: "祝建云",
      checked: false,
      isUsed: false,

      Images: "/upload/user/20180717052232040.jpg"
      }
  ]
  },
  {
  pkid: 2,
  Realname: "玩个游戏",
  type: 1,
  checked: false,
  extend: false,

  children: [
      {
      pkid: "1194",
      Username: "13520123285",
      Realname: "李澄薇",
      checked: false,
      isUsed: false,

      Images: "/upload/user/875b2f05-5cc1-4b84-9656-da307bbeeb03.png"
      },
      {
      pkid: "1195",
      Username: "13146353585",
      Realname: "张瀚",
      checked: false,
      isUsed: false,

      Images: "/upload/user/7f26c946-3301-4351-b4be-a6473c3e13f6.png"
      },
      {
      pkid: "1325",
      Username: "danwang@apex.top",
      Realname: "王丹",
      checked: false,
      isUsed: false,

      Images: "/upload/user/d8e8aa58-e1ea-47ce-9c48-5244a97f6af4.png"
      }
  ]
  },
  {
  pkid: 3,
  Realname: "个人好友",
  type: 1,
  checked: false,
  extend: false,

  children: [
      {
      pkid: "1206",
      Username: "13718888888",
      Realname: "王艺霖",
      checked: false,
      isUsed: false,

      Images: "/upload/user/53735958-7379-443c-8c76-4d6e7ade9a3c.png"
      },
      {
      pkid: "1202",
      Username: "18333617774",
      Realname: "高宇",
      checked: false,
      isUsed: false,

      Images: "/upload/user/92b31a1b-e2a4-4088-b817-c8153d96ddae.png"
      },
      {
      pkid: "1212",
      Username: "13521523374",
      Realname: "卢洪臣",
      checked: false,
      isUsed: true,

      Images: "/upload/user/20180719110629240.jpeg"
      }
  ]
  }
]

const userList = [
  {
  pkid: "1189",
  Username: "18210525140",
  Realname: "罗建鹏",
  checked: false,
  Images: "/upload/user/6ce20ef2-4141-40e2-9597-4f41c081495a.png"
  },
  {
  pkid: "1196",
  Username: "18600120960",
  Realname: "袁沛豪",
  checked: false,
  Images: "/upload/user/67c56166-c8c4-406f-85fb-dcf2637136a4.png"
  },
  {
  pkid: "1204",
  Username: "13161232370",
  Realname: "赵珂",
  checked: false,
  Images: "/upload/user/20180719085213642.jpg"
  },
  {
  pkid: "1212",
  Username: "13521523374",
  Realname: "卢洪臣",
  checked: false,
  Images: "/upload/user/20180719110629240.jpeg"
  }
];
export {
    tesk,
    tesk1,
    file,
    reply,
    log,
    details,
    people,
    searchList,
    preList
}