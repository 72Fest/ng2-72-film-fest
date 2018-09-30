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
    @IBOutlet weak var logoLabel: WKInterfaceLabel!
    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        
        // TODO: manage and store data in delegate
        let myDelegate = WKExtension.shared().delegate as! ExtensionDelegate

        // Configure custom font
        let labelFont = "Countdown"
        
        let customFont = UIFont(name: "Amatic SC", size: 28.0)
        let fontAttrs = [NSAttributedString.Key.font : customFont]
        let attrString = NSAttributedString(string: labelFont, attributes: fontAttrs as [NSAttributedString.Key : Any])
        self.logoLabel.setAttributedText(attrString)
        
        // Configure interface objects here.
        let apiEndpoint: String = "https://api.72fest.com/api/countDown"
        
        guard let url = URL(string: apiEndpoint) else {
            print("Error: cannon create URL")
            return
        }
        let urlRequest = URLRequest(url: url)
        
        // set up the session
        let config = URLSessionConfiguration.default
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        let session = URLSession(configuration: config)
        
        // make the request
        let task = session.dataTask(with: urlRequest) {
            (data, response, error) in
            // check for error
            guard error == nil else {
                print("error getting countdown")
                print(error!)
                return
            }
            
            // make sure we got data
            guard let responseData = data else {
                print("Error: did no receive data")
                return
            }
        
            // parse the result as JSON
            do {
                guard let countdownJSON = try JSONSerialization.jsonObject(with: responseData, options: [])
                    as? [String: Any] else {
                        print("error trying to convert data to JSON")
                        return
                }
                
                guard let countdownMsg = countdownJSON["message"] as? [String: Any] else {
                    print("error trying to convert data to object")
                    return
                }
                
                guard let countdownCaption = countdownMsg["caption"] as? String else {
                    print("error when retrieving caption")
                    return
                }
                
                guard let countdownTime = countdownMsg["time"] as? [String : Any] else {
                    print ("error trying to get time object")
                    return
                }
                
                // set label
                self.countdownLabel.setText(countdownCaption);
                
                let timeYear = countdownTime["year"] as? Int;
                let timeMonth = countdownTime["month"] as? Int;
                let timeDay = countdownTime["day"] as? Int;
                let timeHour = countdownTime["hour"] as? Int;
                let timeMinute = countdownTime["minute"] as? Int;
                
                var dateComponent = DateComponents()
                dateComponent.year = timeYear
                dateComponent.month = timeMonth
                dateComponent.day = timeDay
                dateComponent.hour = timeHour
                dateComponent.minute = timeMinute
                dateComponent.second = 0
                dateComponent.timeZone = TimeZone(abbreviation: "EST")
                
                let userCalendar = Calendar.current
                let countdownDate = userCalendar.date(from: dateComponent)
                
                self.countdownTimer.setDate( countdownDate ?? Date())
                self.countdownTimer.start()
                
                print(countdownTime )
            } catch {
                print("error trying to conver data to JSON")
                return
            }
        }
        
        task.resume()
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
