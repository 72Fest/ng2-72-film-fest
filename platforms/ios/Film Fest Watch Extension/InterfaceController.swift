//
//  InterfaceController.swift
//  Film Fest Watch Extension
//
//  Created by Carpe Lucem Photo on 9/27/18.
//

import WatchKit
import Foundation


class InterfaceController: WKInterfaceController {

    @IBOutlet weak var countdownLabel: WKInterfaceLabel!
    @IBOutlet weak var countdownTimer: WKInterfaceTimer!
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

}
