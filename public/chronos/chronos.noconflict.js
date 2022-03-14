/*  
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 *
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 *  
 * This script should be loaded before chronos core when using jquery flot along with chronos js.
 * This is added to ensure backward compatibility for chronos 5.2.7 and below.
 * 
 * This file need to be added only if there is a conflict for the $.plot object from Chronos version 5.2.8
 *  
 * @author A-2094, Maintained by TCC.
 * name : chronos-noconflict
 * version: 6.10.6
 *
 */
 preventChronosPlotConflict = true;
 