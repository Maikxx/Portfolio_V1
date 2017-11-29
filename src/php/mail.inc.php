<?php
$name = $email = $message = '';
$outputMessage = '';

function test_input($data) {
  $data = trim($data);
  $data = htmlspecialchars($data);
  return $data;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = test_input($_POST['email']);
    $message = test_input($_POST['message']);
    $name = test_input($_POST['name']);

    if (empty($name) || empty($email) || empty($message)) {
        $outputMessage = 'Make sure to have all fields filled out!';
        echo json_encode($outputMessage);
        die;
    } elseif (!preg_match('/^[a-zA-Z ]*$/', $name)) {
        $outputMessage = 'Your name may contain illegitimate characters!';
        echo json_encode($outputMessage);
        die;
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $outputMessage = 'Your email-address may not be valid!';
        echo json_encode($outputMessage);
        die;
    } else {
        $to = 'maikeloo10@hotmail.com';
        $from = $email;

        $name = htmlspecialchars_decode($name);
        $message = htmlspecialchars_decode($message);

        // Mail to myself.
        $subject = 'Form submission - Maikel van Veen';
        $emailMessage = $name . ' wrote the following:' . '\n\n' . $message;
        $headers = 'From:' . $from;
        mail($to, $subject, $emailMessage, $headers);

        // Copy to the mailer.
        $subjectCopy = 'Copy of your form submission - Maikel van Veen';
        $emailMessageCopy = 'Here is a copy of your message ' . $name . '\n\n' . $message;
        $headersCopy = 'From:' . $to;
        mail($from, $subjectCopy, $emailMessageCopy, $headersCopy); 

        $outputMessage = 'Thank you for emailing me, I will contact you shortly!';
        echo json_encode($outputMessage);
        die;
     }
}
?>