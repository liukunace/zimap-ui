export default {
  name : "z-map-ui",
  map : null,
  geoSearchLayer : null,
  setMap(map){
    this.map=map
  },
  getMap(){
    return this.map
  },
  setGeoSearchLayer(layer){
    this.geoSearchLayer=layer
  },
  //'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle'
  testData3: {
    "type": "PolygonString",
    "coordinates": [[[116.800358379948,36.3177143051556],[116.799885020295,36.3184873787142],[116.799850764813,36.3185544553627],[116.799809499652,36.3186189062737],[116.799761530517,36.3186802539771],[116.799707212776,36.3187380439923],[116.79964694883,36.3187918481949],[116.799581185131,36.3188412679885],[116.799510408874,36.3188859372576],[116.79921820148,36.3217054581383],[116.799192705487,36.3220493532366],[116.79915122895,36.3223898659445],[116.798835727856,36.324138898752],[116.798722330426,36.3247970188577],[116.79860600356,36.3256012746373],[116.798549108209,36.3260012369428],[116.798115395498,36.328855813339],[116.797836873261,36.3302410662911],[116.797675097366,36.3307971118611],[116.797470360346,36.3313900186693],[116.797024976969,36.3317965872291],[116.795929346384,36.3327621135675],[116.795527333039,36.3333237052513],[116.795277633132,36.334056299814],[116.795206276327,36.3342419037564],[116.795288146643,36.3342591059959],[116.795371521897,36.334270677951],[116.795455810338,36.3342765374903],[116.795540413733,36.334276643026],[116.795624731611,36.3342709938091],[116.795708165531,36.3342596299345],[116.795790123324,36.334242632057],[116.795813105055,36.3341828549982],[116.796046159053,36.3334990978671],[116.796381697699,36.3330303678728],[116.797149850938,36.3323534315092],[116.796966327451,36.3331343552143],[116.796799615392,36.3339466093244],[116.796905104408,36.3338989569302],[116.797007065726,36.3338465272301],[116.797105168168,36.3337894905203],[116.797199093087,36.3337280320607],[116.797288535408,36.3336623514738],[116.797373204615,36.3335926620957],[116.797452825695,36.3335191902833],[116.797515654324,36.3332130767825],[116.797699578906,36.3324304463485],[116.798322037988,36.3297987283494],[116.798527344103,36.3290262237135],[116.799069838767,36.3260020942314],[116.800076127617,36.3193255877277],[116.800358379948,36.3177143051556]]]
  },
  testData2: {
    "type": "PolygonString",
    "coordinates": [[[116.800358379948,36.3177143051556],[116.800076127617,36.3193255877277],[116.799069838767,36.3260020942314],[116.798527344103,36.3290262237135],[116.798322037988,36.3297987283494],[116.797699578906,36.3324304463485],[116.797515654324,36.3332130767825],[116.797452825695,36.3335191902833],[116.797492317529,36.3334793918202],[116.797529154852,36.3334411153211],[116.797574974135,36.3333983229558],[116.797626070547,36.3333596286276],[116.797681885348,36.3333254554588],[116.797741808205,36.333296177133],[116.79780518386,36.3332721138085],[116.797871319301,36.3332535286177],[116.797939491338,36.3332406247895],[116.798008954509,36.3332335434273],[116.798078949235,36.3332323619658],[116.798247630746,36.3325145933938],[116.798868839061,36.329888163563],[116.799076776793,36.3291057569508],[116.799622888988,36.32606146159],[116.800629290465,36.3193842078315],[116.800963064624,36.3174788046594],[116.800849876549,36.3174832742932],[116.800737295524,36.317493764251],[116.800625811455,36.317510228885],[116.800515909472,36.3175325965481],[116.800496172428,36.3175386523602],[116.80047794758,36.3175472656313],[116.800461738387,36.317558198421],[116.800447992628,36.3175711487123],[116.800437090025,36.3175857587551],[116.800358379948,36.3177143051556]]]
  },
  testData:{
    "type": "LineString",
    "coordinates": [
      [
        3.8642314,
        7.3638372
      ],
      [
        3.8642322,
        7.3638263
      ],
      [
        3.8642321,
        7.3638187
      ],
      [
        3.8642351,
        7.363813
      ],
      [
        3.8642313,
        7.3638197
      ],
      [
        3.86423,
        7.363822
      ],
      [
        3.8642297,
        7.3638226
      ],
      [
        3.8645671,
        7.3638316
      ],
      [
        3.8584942,
        7.3664206
      ],
      [
        3.8581749,
        7.3665805
      ],
      [
        3.8634158,
        7.363614
      ],
      [
        3.8607662,
        7.3652287
      ],
      [
        3.8582844,
        7.3665207
      ],
      [
        3.8582065,
        7.3665678
      ],
      [
        3.8616121,
        7.3652571
      ],
      [
        3.8622972,
        7.3678108
      ],
      [
        3.8614151,
        7.3670398
      ],
      [
        3.8612262,
        7.3673434
      ],
      [
        3.8610316,
        7.3681816
      ],
      [
        3.8611909,
        7.3673296
      ],
      [
        3.859467,
        7.3705987
      ],
      [
        3.8594616,
        7.3714506
      ],
      [
        3.8594572,
        7.3724274
      ],
      [
        3.8743643,
        7.3516949
      ],
      [
        3.8743886,
        7.3516611
      ],
      [
        3.8743917,
        7.3516567
      ],
      [
        3.8743931,
        7.3516548
      ],
      [
        3.8360856,
        7.3680548
      ],
      [
        3.8360397,
        7.3680376
      ],
      [
        3.8728716,
        7.3552709
      ],
      [
        3.8731475,
        7.3551753
      ],
      [
        3.8583077,
        7.3753265
      ],
      [
        3.8538401,
        7.3756453
      ],
      [
        3.8520508,
        7.3757729
      ],
      [
        3.8439154,
        7.3750759
      ],
      [
        3.843774,
        7.3750851
      ],
      [
        3.8437264,
        7.3750882
      ],
      [
        3.8437236,
        7.3750884
      ],
      [
        3.8437234,
        7.3750884
      ],
      [
        3.8437234,
        7.3750884
      ],
      [
        3.857464,
        7.3741881
      ],
      [
        3.8590392,
        7.3741355
      ],
      [
        3.8587835,
        7.3741095
      ],
      [
        3.859557,
        7.3715848
      ],
      [
        3.860038,
        7.3680896
      ],
      [
        3.8599294,
        7.368377
      ],
      [
        3.8620091,
        7.3756726
      ],
      [
        3.8609145,
        7.3788052
      ],
      [
        3.8628813,
        7.3754659
      ],
      [
        3.8631895,
        7.3752267
      ],
      [
        3.8631963,
        7.3752178
      ],
      [
        3.8630035,
        7.3753683
      ],
      [
        3.8646583,
        7.3752733
      ],
      [
        3.8646672,
        7.3752728
      ],
      [
        3.8646672,
        7.3752728
      ],
      [
        3.8667067,
        7.3744384
      ],
      [
        3.8674178,
        7.3767107
      ],
      [
        3.8674235,
        7.3765156
      ],
      [
        3.8674237,
        7.3765089
      ],
      [
        3.8692193,
        7.3787671
      ],
      [
        3.8778869,
        7.3877754
      ],
      [
        3.8779165,
        7.3878061
      ],
      [
        3.8779246,
        7.3878145
      ],
      [
        3.8779277,
        7.3878178
      ],
      [
        3.8711046,
        7.3829512
      ],
      [
        3.8710566,
        7.3830346
      ],
      [
        3.8698253,
        7.3820837
      ],
      [
        3.8698253,
        7.3820837
      ],
      [
        3.8706937,
        7.3679175
      ],
      [
        3.8782309,
        7.3877665
      ],
      [
        3.8783814,
        7.3877862
      ],
      [
        3.8760441,
        7.3863476
      ],
      [
        3.8772434,
        7.3873921
      ],
      [
        3.878296,
        7.3876265
      ],
      [
        3.8782487,
        7.3876651
      ],
      [
        3.8780169,
        7.3877684
      ],
      [
        3.8783124,
        7.3876447
      ],
      [
        3.8778513,
        7.3890221
      ],
      [
        3.8784465,
        7.3887713
      ],
      [
        3.879216,
        7.3894444
      ],
      [
        3.8797221,
        7.3897053
      ],
      [
        3.880476,
        7.3908925
      ],
      [
        3.8805055,
        7.391361
      ],
      [
        3.8822697,
        7.3928171
      ],
      [
        3.8823158,
        7.3928552
      ],
      [
        3.8823169,
        7.3928561
      ],
      [
        3.8823169,
        7.3928561
      ],
      [
        3.8824417,
        7.3920754
      ],
      [
        3.8823238,
        7.392806
      ],
      [
        3.8825391,
        7.3926829
      ],
      [
        3.8825451,
        7.3927262
      ],
      [
        3.883023,
        7.3930246
      ],
      [
        3.8840187,
        7.3936367
      ],
      [
        3.8843184,
        7.3938874
      ],
      [
        3.8853404,
        7.3944697
      ],
      [
        3.8876022,
        7.3970627
      ],
      [
        3.8869724,
        7.3962297
      ],
      [
        3.8870385,
        7.3965095
      ],
      [
        3.8870569,
        7.3966905
      ],
      [
        3.8871019,
        7.3966826
      ],
      [
        3.8871142,
        7.3967244
      ],
      [
        3.8879796,
        7.3975827
      ],
      [
        3.8880279,
        7.3976746
      ],
      [
        3.8881707,
        7.3982315
      ],
      [
        3.8890188,
        7.3990452
      ],
      [
        3.8895878,
        7.3997389
      ],
      [
        3.8903308,
        7.4001758
      ],
      [
        3.8900365,
        7.4001174
      ],
      [
        3.890607,
        7.4005194
      ],
      [
        3.8906317,
        7.4008319
      ],
      [
        3.8905867,
        7.4007725
      ],
      [
        3.8912383,
        7.4008057
      ],
      [
        3.8917804,
        7.4007263
      ],
      [
        3.8916686,
        7.4008293
      ],
      [
        3.8929482,
        7.4006056
      ],
      [
        3.8938087,
        7.4009536
      ],
      [
        3.8992147,
        7.4024739
      ],
      [
        3.8995205,
        7.4025599
      ],
      [
        3.8982551,
        7.4010581
      ],
      [
        3.8982162,
        7.401012
      ],
      [
        3.8987606,
        7.4003669
      ],
      [
        3.8993808,
        7.4003954
      ],
      [
        3.900541,
        7.4002734
      ],
      [
        3.9028167,
        7.3989092
      ],
      [
        3.9018996,
        7.4006134
      ],
      [
        3.9018583,
        7.4006901
      ],
      [
        3.9030388,
        7.3988011
      ],
      [
        3.9014141,
        7.4012787
      ],
      [
        3.9015908,
        7.4016371
      ],
      [
        3.905474,
        7.3989561
      ],
      [
        3.9065891,
        7.3984394
      ],
      [
        3.9101003,
        7.3982771
      ],
      [
        3.9103405,
        7.398266
      ],
      [
        3.9088401,
        7.3984812
      ],
      [
        3.9102711,
        7.3982771
      ],
      [
        3.9103509,
        7.3982657
      ],
      [
        3.9109903,
        7.3985538
      ],
      [
        3.9143534,
        7.3972069
      ],
      [
        3.9144899,
        7.3972223
      ],
      [
        3.9140685,
        7.397191
      ],
      [
        3.9145968,
        7.3972698
      ],
      [
        3.9146289,
        7.3972745
      ],
      [
        3.9143885,
        7.3958557
      ],
      [
        3.9178067,
        7.3965262
      ],
      [
        3.9178067,
        7.3965262
      ],
      [
        3.9186793,
        7.3951855
      ],
      [
        3.919134,
        7.3955498
      ],
      [
        3.9191563,
        7.3955677
      ],
      [
        3.9194377,
        7.3956562
      ],
      [
        3.9203783,
        7.397256
      ],
      [
        3.9215347,
        7.3986448
      ],
      [
        3.9209043,
        7.3973655
      ],
      [
        3.9220342,
        7.3994774
      ],
      [
        3.9231603,
        7.400736
      ],
      [
        3.9232213,
        7.4008041
      ],
      [
        3.9233057,
        7.4011721
      ],
      [
        3.9232224,
        7.4008054
      ],
      [
        3.9245615,
        7.4009836
      ],
      [
        3.9246104,
        7.4009902
      ],
      [
        3.9233057,
        7.4011721
      ],
      [
        3.9263528,
        7.4035227
      ],
      [
        3.9251564,
        7.4041799
      ],
      [
        3.9251,
        7.4042109
      ],
      [
        3.9250845,
        7.4042195
      ],
      [
        3.9250785,
        7.4042227
      ],
      [
        3.9274002,
        7.4063355
      ],
      [
        3.927453,
        7.4063835
      ],
      [
        3.9274684,
        7.4063975
      ],
      [
        3.9290233,
        7.4089717
      ],
      [
        3.9290233,
        7.4089717
      ],
      [
        3.9304233,
        7.4108633
      ],
      [
        3.93118,
        7.41168
      ],
      [
        3.9318917,
        7.4125317
      ],
      [
        3.9325633,
        7.41336
      ],
      [
        3.93314,
        7.4142683
      ],
      [
        3.9336233,
        7.4152667
      ],
      [
        3.9336233,
        7.4152667
      ],
      [
        3.9336267,
        7.4172633
      ],
      [
        3.9336267,
        7.418225
      ],
      [
        3.9341833,
        7.4190767
      ],
      [
        3.9347817,
        7.419875
      ],
      [
        3.9353317,
        7.420645
      ],
      [
        3.9353317,
        7.420645
      ],
      [
        3.9355646,
        7.4210168
      ],
      [
        3.9358383,
        7.4224317
      ],
      [
        3.9362283,
        7.4229817
      ],
      [
        3.9366867,
        7.4232983
      ],
      [
        3.937055,
        7.4235917
      ],
      [
        3.9373017,
        7.4240167
      ],
      [
        3.9379589,
        7.4246485
      ],
      [
        3.9379589,
        7.4246485
      ],
      [
        3.9375995,
        7.4248314
      ],
      [
        3.9376206,
        7.4249003
      ],
      [
        3.9376253,
        7.4249155
      ],
      [
        3.937628,
        7.4249239
      ],
      [
        3.9376251,
        7.4249309
      ],
      [
        3.9376852,
        7.4250668
      ],
      [
        3.9376912,
        7.4250803
      ],
      [
        3.9376924,
        7.4250831
      ],
      [
        3.9376928,
        7.4250839
      ],
      [
        3.937693,
        7.4250844
      ],
      [
        3.9376931,
        7.4250846
      ],
      [
        3.9376933,
        7.425085
      ],
      [
        3.937759,
        7.4251984
      ],
      [
        3.9378207,
        7.4253454
      ],
      [
        3.9378748,
        7.4254872
      ],
      [
        3.937861,
        7.4256418
      ],
      [
        3.9378849,
        7.4258103
      ],
      [
        3.9378932,
        7.4258644
      ],
      [
        3.9379325,
        7.4259814
      ],
      [
        3.9380197,
        7.4261942
      ],
      [
        3.9381184,
        7.4264869
      ],
      [
        3.9382273,
        7.4267193
      ],
      [
        3.9384483,
        7.4271467
      ],
      [
        3.938653,
        7.4275576
      ],
      [
        3.9386656,
        7.4275724
      ],
      [
        3.9386687,
        7.4275754
      ],
      [
        3.9386699,
        7.4275766
      ],
      [
        3.9387181,
        7.427604
      ],
      [
        3.9387528,
        7.4276238
      ],
      [
        3.938755,
        7.427625
      ],
      [
        3.9388006,
        7.4277118
      ],
      [
        3.9388059,
        7.4277217
      ],
      [
        3.9388539,
        7.4278437
      ],
      [
        3.9388543,
        7.4278448
      ],
      [
        3.93907,
        7.4281583
      ],
      [
        3.9393767,
        7.428535
      ],
      [
        3.9393767,
        7.428535
      ],
      [
        3.9395733,
        7.4289867
      ],
      [
        3.9402667,
        7.4302217
      ],
      [
        3.9406283,
        7.4307667
      ],
      [
        3.9410217,
        7.4313667
      ],
      [
        3.9414267,
        7.4318917
      ],
      [
        3.94172,
        7.4322367
      ],
      [
        3.9419719,
        7.4323064
      ],
      [
        3.9419511,
        7.4325676
      ],
      [
        3.9423408,
        7.4328004
      ],
      [
        3.9425206,
        7.4329472
      ],
      [
        3.9430533,
        7.4336217
      ],
      [
        3.9435233,
        7.434075
      ],
      [
        3.9441133,
        7.434545
      ],
      [
        3.9452283,
        7.4353917
      ],
      [
        3.9456433,
        7.43572
      ],
      [
        3.9459483,
        7.4359633
      ],
      [
        3.9462766,
        7.436224
      ],
      [
        3.9465403,
        7.4364327
      ],
      [
        3.94674,
        7.4366021
      ],
      [
        3.9469181,
        7.4367382
      ],
      [
        3.9469387,
        7.4367529
      ],
      [
        3.9469405,
        7.4367542
      ],
      [
        3.9469405,
        7.4367542
      ],
      [
        3.9469412,
        7.4367546
      ],
      [
        3.9469417,
        7.436755
      ],
      [
        3.9469417,
        7.436755
      ],
      [
        3.947335,
        7.4370867
      ],
      [
        3.947955,
        7.4375783
      ],
      [
        3.947955,
        7.4375783
      ],
      [
        3.948595,
        7.4380767
      ],
      [
        3.9492867,
        7.4385967
      ],
      [
        3.9501139,
        7.4394913
      ],
      [
        3.950935,
        7.4405033
      ],
      [
        3.9512083,
        7.4411033
      ],
      [
        3.9513417,
        7.4415556
      ],
      [
        3.951404,
        7.441658
      ],
      [
        3.951405,
        7.4416597
      ],
      [
        3.9514073,
        7.4416635
      ],
      [
        3.9514075,
        7.4416636
      ],
      [
        3.9514083,
        7.441665
      ],
      [
        3.9514083,
        7.441665
      ],
      [
        3.9513179,
        7.4415606
      ],
      [
        3.9513179,
        7.4415606
      ],
      [
        3.9458376,
        7.4356287
      ],
      [
        3.9458312,
        7.4356217
      ],
      [
        3.9458312,
        7.4356217
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.9458402,
        7.4356323
      ],
      [
        3.945834,
        7.4356251
      ],
      [
        3.9458324,
        7.4356231
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.9519851,
        7.4429041
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.945831,
        7.4356215
      ],
      [
        3.9513501,
        7.4421527
      ],
      [
        3.9461089,
        7.4359504
      ],
      [
        3.9458399,
        7.435632
      ],
      [
        3.9458339,
        7.4356249
      ],
      [
        3.9458311,
        7.4356216
      ],
      [
        3.9458311,
        7.4356216
      ],
      [
        3.9513462,
        7.4424903
      ],
      [
        3.9513183,
        7.4415741
      ],
      [
        3.9513179,
        7.4415608
      ],
      [
        3.9513179,
        7.4415606
      ],
      [
        3.9508252,
        7.4404881
      ],
      [
        3.950322,
        7.4398658
      ],
      [
        3.9503063,
        7.4398464
      ],
      [
        3.9503025,
        7.4398417
      ],
      [
        3.9480229,
        7.4369872
      ],
      [
        3.9479247,
        7.4368643
      ],
      [
        3.9479197,
        7.436858
      ],
      [
        3.9467504,
        7.4363763
      ],
      [
        3.9467016,
        7.4363562
      ],
      [
        3.9466974,
        7.4363544
      ],
      [
        3.9466973,
        7.4363544
      ],
      [
        3.9453734,
        7.4358122
      ],
      [
        3.9453452,
        7.4358006
      ],
      [
        3.9453438,
        7.4358001
      ],
      [
        3.9453434,
        7.4357999
      ],
      [
        3.9453433,
        7.4357999
      ],
      [
        3.942267,
        7.4323235
      ],
      [
        3.9421929,
        7.4322398
      ],
      [
        3.9421917,
        7.4322384
      ],
      [
        3.9422298,
        7.4328038
      ],
      [
        3.94188,
        7.4328127
      ],
      [
        3.9420736,
        7.4323569
      ],
      [
        3.9420818,
        7.4323376
      ],
      [
        3.9420821,
        7.4323369
      ],
      [
        3.9412029,
        7.431041
      ],
      [
        3.9408677,
        7.4308017
      ],
      [
        3.9405671,
        7.4306734
      ],
      [
        3.9406799,
        7.4307094
      ],
      [
        3.9400729,
        7.4300296
      ],
      [
        3.9394944,
        7.4292004
      ],
      [
        3.9394695,
        7.4291647
      ],
      [
        3.9394525,
        7.4291403
      ],
      [
        3.9394497,
        7.4291362
      ],
      [
        3.9380682,
        7.4262913
      ],
      [
        3.9379648,
        7.4266674
      ],
      [
        3.9378425,
        7.4260127
      ],
      [
        3.937934,
        7.4260175
      ],
      [
        3.937396,
        7.4255351
      ],
      [
        3.9373854,
        7.4255221
      ],
      [
        3.9373852,
        7.4255218
      ],
      [
        3.9344545,
        7.4219812
      ],
      [
        3.93687,
        7.4238584
      ],
      [
        3.93687,
        7.4238584
      ]
    ]
  },

}

